import { CardsQuiz } from "../models/cards-quiz";
import { validateCardsSearchDirection } from "../models/cards-search-direction";
import { validateCardsSearchOrder } from "../models/cards-search-order";
import { timeToMs } from "../models/time";

const seconds = 1000;
const minutes = 60 * seconds;

export default function useCardsQuizFromParams(): CardsQuiz {
  const params = new URLSearchParams(document.location.search);

  return {
    name: params.get("name") ?? "",
    query: params.get("q") ?? "",
    order: validateCardsSearchOrder(params.get("order")),
    direction: validateCardsSearchDirection(params.get("dir")),
    quantity: clamp(parseInt(params.get("qty") ?? "50") || 50, 1, 175),
    time: clamp(
      timeToMs(params.get("time") ?? "10:00"),
      1 * seconds,
      60 * minutes - 1 * seconds,
    ),
    hints: {
      showCost: params.has("show-cost") ?? false,
      showColors: params.has("show-colors") ?? false,
      showIdentity: params.has("show-identity") ?? false,
      showTypes: params.has("show-types") ?? false,
      showUsd: params.has("show-usd") ?? false,
      showEur: params.has("show-eur") ?? false,
      showTix: params.has("show-tix") ?? false,
    },
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}
