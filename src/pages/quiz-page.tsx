import { ScryfallList } from "@scryfall/api-types";
import { useLayoutEffect, useState } from "react";
import CardsQuiz from "../components/cards-quiz";
import { CardsQuizAnswer } from "../models/cards-quiz-answer";
import {
  formattedCardsSearchDirection,
  validateCardsSearchDirection,
} from "../models/cards-search-direction";
import {
  formattedCardsSearchOrder,
  validateCardsSearchOrder,
} from "../models/cards-search-order";
import { formatHints } from "../models/hints";
import { timeToMs } from "../models/time";
import "./quiz-page.css";

export default function QuizPage() {
  const [answers, setAnswers] = useState<CardsQuizAnswer[] | undefined>(
    undefined,
  );

  const params = new URLSearchParams(document.location.search);
  const name = params.get("name") ?? "Unnamed";
  const query = params.get("q") ?? "";
  const order = validateCardsSearchOrder(params.get("order"));
  const direction = validateCardsSearchDirection(params.get("dir"));
  const quantity = parseInt(params.get("qty") ?? "0") || 0;
  const time = timeToMs(params.get("time") ?? "10:00");
  const showCost = params.has("show-cost") ?? false;
  const showColors = params.has("show-colors") ?? false;
  const showIdentity = params.has("show-identity") ?? false;
  const showTypes = params.has("show-types") ?? false;
  const showUsd = params.has("show-usd") ?? false;
  const showEur = params.has("show-eur") ?? false;
  const showTix = params.has("show-tix") ?? false;

  const formattedOrder = formattedCardsSearchOrder[order];
  const formattedDirection = formattedCardsSearchDirection[direction];
  const formattedHints = formatHints({
    showColors,
    showCost,
    showEur,
    showIdentity,
    showTix,
    showTypes,
    showUsd,
  });

  useLayoutEffect(() => {
    const fetchCards = async () => {
      const url = new URL("https://api.scryfall.com/cards/search");
      url.searchParams.set("q", query);
      url.searchParams.set("order", order);
      url.searchParams.set("dir", direction);
      const response: ScryfallList.Cards = await (await fetch(url)).json();
      const cards = response.data;
      setAnswers(
        cards.slice(0, quantity || undefined).map((card) => {
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
    fetchCards();
  }, [quantity, query, order, direction]);

  return (
    <div className="QuizPage">
      <div>
        <h1>{name}</h1>
        <span>
          <i>{`${query} | Order: ${formattedOrder}, ${formattedDirection} | Hints: ${formattedHints}`}</i>
        </span>
      </div>

      {answers ? (
        <CardsQuiz
          answers={answers}
          duration={time}
          showColors={showColors}
          showCost={showCost}
          showIdentity={showIdentity}
          showPriceEur={showEur}
          showPriceTix={showTix}
          showPriceUsd={showUsd}
        />
      ) : null}
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
