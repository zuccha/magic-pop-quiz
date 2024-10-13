import { clamp, padL } from "../utils";
import {
  CardsQuizDirection,
  cardsQuizDirectionDecodings,
  CardsQuizDirectionEncoding,
  cardsQuizDirectionEncodings,
  validateCardsQuizDirection,
} from "./cards-quiz-direction";
import {
  CardsQuizOrder,
  cardsQuizOrderDecodings,
  CardsQuizOrderEncoding,
  cardsQuizOrderEncodings,
  validateCardsQuizOrder,
} from "./cards-quiz-order";
import {
  decodeCardsQuizHints,
  encodeCardsQuizHints,
  CardsQuizHints,
} from "./cards-quiz-hints";
import { timeToMs, seconds, minutes, msToTime } from "./time";

export type CardsQuiz = {
  id: string;
  name: string;
  query: string;
  order: CardsQuizOrder;
  direction: CardsQuizDirection;
  quantity: number;
  time: number;
  hints: CardsQuizHints;
};

export function loadCardsQuizFromParams(): CardsQuiz {
  const params = new URLSearchParams(document.location.search);

  return cardsQuizFromValues({
    name: params.get("name") ?? "",
    query: params.get("q") ?? "",
    order: validateCardsQuizOrder(params.get("order")),
    direction: validateCardsQuizDirection(params.get("dir")),
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
  });
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

export function cardsQuizFromValues(quiz: Omit<CardsQuiz, "id">): CardsQuiz {
  const order = cardsQuizOrderEncodings[quiz.order];
  const direction = cardsQuizDirectionEncodings[quiz.direction];
  const quantity = padL(`${quiz.quantity}`, 3, "0");
  const time = msToTime(quiz.time);
  const hints = encodeCardsQuizHints(quiz.hints);
  const id = `cs0000${order}${direction}${quantity}${time}${hints}${quiz.query}`;
  return { ...quiz, id };
}

export function cardsQuizFromId(id: string, name: string): CardsQuiz {
  const order = id.slice(6, 8) as CardsQuizOrderEncoding;
  const dir = id.slice(8, 9) as CardsQuizDirectionEncoding;
  return {
    id,
    name,
    order: cardsQuizOrderDecodings[order] ?? "name",
    direction: cardsQuizDirectionDecodings[dir] ?? "auto",
    quantity: parseInt(id.slice(9, 12)) || 0,
    time: timeToMs(id.slice(12, 17)),
    hints: decodeCardsQuizHints(id.slice(17, 33)),
    query: id.slice(33),
  };
}
