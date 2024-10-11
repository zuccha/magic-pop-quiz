import { ScryfallCard } from "@scryfall/api-types";
import { useCallback, useLayoutEffect, useState } from "react";
import CardsQuiz from "../components/cards-quiz";
import { typeInfos } from "../components/card-types-indicator";
import { useCardsQuizIsFavorite } from "../hooks/use-cards-quiz";
import {
  loadCardsQuizFromParams,
  saveCardsQuizToParams,
} from "../models/cards-quiz";
import { CardsQuizAnswer } from "../models/cards-quiz-answer";
import { formattedCardsSearchDirection } from "../models/cards-search-direction";
import { formattedCardsSearchOrder } from "../models/cards-search-order";
import { formatHints } from "../models/hints";
import "./quiz-page.css";

export default function QuizPage() {
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<CardsQuizAnswer[] | undefined>(
    undefined,
  );

  const quiz = loadCardsQuizFromParams();
  const [isFavorite, toggleIsFavorite] = useCardsQuizIsFavorite(quiz);

  const formattedOrder = formattedCardsSearchOrder[quiz.order];
  const formattedDirection = formattedCardsSearchDirection[quiz.direction];
  const formattedHints = formatHints(quiz.hints);

  const edit = useCallback(() => saveCardsQuizToParams(quiz), [quiz]);

  useLayoutEffect(() => {
    const fetchCards = async () => {
      const url = new URL("https://api.scryfall.com/cards/search");
      url.searchParams.set("q", quiz.query);
      url.searchParams.set("order", quiz.order);
      url.searchParams.set("dir", quiz.direction);
      const response = await (await fetch(url)).json();
      if (response.object === "error") {
        setError(
          response.status === 404
            ? "No cards found for the given query"
            : "An error occurred",
        );
        setAnswers(undefined);
        return;
      }

      const cards = response.data as ScryfallCard.Any[];
      setError("");
      setAnswers(
        cards.slice(0, quiz.quantity || undefined).map((card) => {
          return {
            id: card.id,
            name: card.name,
            simpleName: normalize(card.name),
            simpleNames: card.name.split("//").map(normalize),
            simpleShortName: normalize(card.name.split(",")[0]),
            simpleShortNames: card.name
              .split("//")
              .map((name) => normalize(name.split(",")[0])),
            set: card.set_name,
            cost: card.mana_cost
              ? (card.mana_cost.match(/{[^}]+}|\/\//g) ?? [])
              : "card_faces" in card
                ? card.card_faces.flatMap(
                    (face) => face.mana_cost?.match(/{[^}]+}|\/\//g) ?? [],
                  )
                : [],
            identity: sortColors(card.color_identity),
            colors: sortColors(
              "colors" in card && card.colors
                ? card.colors
                : "card_faces" in card
                  ? card.card_faces.flatMap((face) =>
                      "colors" in face ? face.colors : [],
                    )
                  : [],
            ),
            types:
              "card_faces" in card
                ? splitTypes(card.card_faces[0]?.type_line)
                : splitTypes(card.type_line),
            stats: {
              power:
                "card_faces" in card
                  ? (card.card_faces[0]?.power ?? "-")
                  : (card.power ?? "-"),
              toughness:
                "card_faces" in card
                  ? (card.card_faces[0]?.toughness ?? "-")
                  : (card.toughness ?? "-"),
            },
            image:
              "image_uris" in card && card.image_uris
                ? card.image_uris.normal
                : "card_faces" in card &&
                    "image_uris" in card.card_faces[0] &&
                    card.card_faces[0].image_uris
                  ? card.card_faces[0].image_uris.normal
                  : "",
            url: card.scryfall_uri,
            price: {
              usd:
                card.prices.usd ??
                card.prices.usd_foil ??
                card.prices.usd_etched ??
                "-",
              eur: card.prices.eur ?? card.prices.eur_foil ?? "-",
              tix: card.prices.tix ?? "-",
            },
          };
        }),
      );
    };

    fetchCards().catch(() => {
      setError("An error occurred");
    });
  }, [quiz.quantity, quiz.query, quiz.order, quiz.direction]);

  return (
    <div className="QuizPage">
      <div className="QuizPage_Header">
        <div>
          <h1>{quiz.name || "Unnamed"}</h1>
          <span>
            <i>{`${quiz.query} | Order: ${formattedOrder}, ${formattedDirection} | Hints: ${formattedHints}`}</i>
          </span>
        </div>

        <div className="QuizPage_Header_Actions">
          <button className="small" onClick={edit}>
            <i className="fa-solid fa-pen" />
            Edit
          </button>

          <button className="small icon" onClick={toggleIsFavorite}>
            <abbr
              className={
                isFavorite
                  ? "fa-solid fa-heart fa-xl"
                  : "fa-regular fa-heart fa-xl"
              }
              title={isFavorite ? "Remove favorite" : "Save favorite"}
            />
          </button>
        </div>
      </div>

      {answers ? (
        <CardsQuiz
          answers={answers}
          duration={quiz.time}
          showColors={quiz.hints.showColors}
          showCost={quiz.hints.showCost}
          showIdentity={quiz.hints.showIdentity}
          showPriceEur={quiz.hints.showPriceEur}
          showPriceTix={quiz.hints.showPriceTix}
          showPriceUsd={quiz.hints.showPriceUsd}
          showStats={quiz.hints.showStats}
          showTypes={quiz.hints.showTypes}
        />
      ) : error ? (
        <div className="QuizPage_Message">
          <h2>{error}</h2>
          <button className="solid" onClick={edit}>
            Edit quiz
          </button>
        </div>
      ) : (
        <div className="QuizPage_Message">
          <h2>Retrieving cards...</h2>
        </div>
      )}
    </div>
  );
}

const colorSortingScore: Record<string, number> = {
  W: 5,
  U: 4,
  B: 3,
  R: 2,
  G: 1,
};

function sortColors(colors: string[]): string[] {
  return [...new Set(colors)].sort((c1, c2) => {
    const score1 = colorSortingScore[c1] ?? 0;
    const score2 = colorSortingScore[c2] ?? 0;
    if (score1 > score2) return -1;
    if (score1 < score2) return 1;
    return 0;
  });
}

function splitTypes(typeLine: string): string[] {
  return (typeLine.split("-")[0] || "")
    .trim()
    .split(" ")
    .filter((type) => typeInfos[type])
    .sort();
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .trim();
}
