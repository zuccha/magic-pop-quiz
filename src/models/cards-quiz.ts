import {
  CardsSearchDirection,
  validateCardsSearchDirection,
} from "./cards-search-direction";
import {
  CardsSearchOrder,
  validateCardsSearchOrder,
} from "./cards-search-order";
import { Hints } from "./hints";
import { timeToMs, seconds, minutes, msToTime } from "./time";

export type CardsQuiz = {
  name: string;
  query: string;
  order: CardsSearchOrder;
  direction: CardsSearchDirection;
  quantity: number;
  time: number;
  hints: Hints;
};

export function loadCardsQuizFromParams(): CardsQuiz {
  const params = new URLSearchParams(document.location.search);

  return {
    name: params.get("name") ?? "",
    query: params.get("q") ?? "",
    order: validateCardsSearchOrder(params.get("order")),
    direction: validateCardsSearchDirection(params.get("dir")),
    quantity: clamp(parseInt(params.get("qty") ?? "50"), 0, 175),
    time: clamp(
      timeToMs(params.get("time") ?? "10:00"),
      1 * seconds,
      60 * minutes - 1 * seconds,
    ),
    hints: {
      showColors: params.has("show-colors") ?? false,
      showCost: params.has("show-cost") ?? false,
      showIdentity: params.has("show-identity") ?? false,
      showPriceEur: params.has("show-price-eur") ?? false,
      showPriceTix: params.has("show-price-tix") ?? false,
      showPriceUsd: params.has("show-price-usd") ?? false,
      showStats: params.has("show-stats") ?? false,
      showTypes: params.has("show-types") ?? false,
    },
  };
}

export function saveCardsQuizToParams(quiz: CardsQuiz): void {
  const url = new URL(document.location.origin);
  url.searchParams.set("name", quiz.name);
  url.searchParams.set("q", quiz.query);
  url.searchParams.set("order", quiz.order);
  url.searchParams.set("dir", quiz.direction);
  url.searchParams.set("qty", `${quiz.quantity}`);
  url.searchParams.set("time", msToTime(quiz.time));
  if (quiz.hints.showColors) url.searchParams.set("show-colors", "on");
  if (quiz.hints.showCost) url.searchParams.set("show-cost", "on");
  if (quiz.hints.showIdentity) url.searchParams.set("show-identity", "on");
  if (quiz.hints.showPriceEur) url.searchParams.set("show-price-eur", "on");
  if (quiz.hints.showPriceTix) url.searchParams.set("show-price-tix", "on");
  if (quiz.hints.showPriceUsd) url.searchParams.set("show-price-usd", "on");
  if (quiz.hints.showStats) url.searchParams.set("show-stats", "on");
  if (quiz.hints.showTypes) url.searchParams.set("show-types", "on");
  document.location.href = url.href;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), min);
}
