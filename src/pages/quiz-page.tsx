import { ScryfallCard } from "@scryfall/api-types";
import { useCallback, useLayoutEffect, useState } from "react";
import CardsQuiz from "../components/cards-quiz";
import useCardsQuizFromParams from "../hooks/use-cards-quiz-from-params";
import { CardsQuizAnswer } from "../models/cards-quiz-answer";
import { formattedCardsSearchDirection } from "../models/cards-search-direction";
import { formattedCardsSearchOrder } from "../models/cards-search-order";
import { formatHints } from "../models/hints";
import { msToTime } from "../models/time";
import "./quiz-page.css";

export default function QuizPage() {
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<CardsQuizAnswer[] | undefined>(
    undefined,
  );

  const quiz = useCardsQuizFromParams();

  const formattedOrder = formattedCardsSearchOrder[quiz.order];
  const formattedDirection = formattedCardsSearchDirection[quiz.direction];
  const formattedHints = formatHints(quiz.hints);

  const edit = useCallback(() => {
    const url = new URL(document.location.origin);
    url.searchParams.set("name", quiz.name);
    url.searchParams.set("q", quiz.query);
    url.searchParams.set("order", quiz.order);
    url.searchParams.set("dir", quiz.direction);
    url.searchParams.set("qty", `${quiz.quantity}`);
    url.searchParams.set("time", msToTime(quiz.time));
    if (quiz.hints.showCost) url.searchParams.set("show-cost", "on");
    if (quiz.hints.showColors) url.searchParams.set("show-colors", "on");
    if (quiz.hints.showIdentity) url.searchParams.set("show-identity", "on");
    if (quiz.hints.showTypes) url.searchParams.set("show-types", "on");
    if (quiz.hints.showUsd) url.searchParams.set("show-usd", "on");
    if (quiz.hints.showEur) url.searchParams.set("show-eur", "on");
    if (quiz.hints.showTix) url.searchParams.set("show-tix", "on");
    document.location.href = url.href;
  }, [quiz]);

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
            simpleName: card.name
              .normalize("NFD")
              .replace(/[^a-zA-Z0-9]/g, "")
              .toLowerCase(),
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
            type:
              "card_faces" in card
                ? (card.card_faces[0]?.type_line.split("-")[0] || "").trim()
                : (card.type_line.split("-")[0] || "").trim(),
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

        <button className="small" onClick={edit}>
          Edit
        </button>
      </div>

      {answers ? (
        <CardsQuiz
          answers={answers}
          duration={quiz.time}
          showColors={quiz.hints.showColors}
          showCost={quiz.hints.showCost}
          showIdentity={quiz.hints.showIdentity}
          showPriceEur={quiz.hints.showEur}
          showPriceTix={quiz.hints.showTix}
          showPriceUsd={quiz.hints.showUsd}
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
