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

export function loadCardsQuizFromParams(params: URLSearchParams): CardsQuiz {
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

export function saveCardsQuizToParams(quiz: CardsQuiz): URLSearchParams {
  const params = new URLSearchParams();
  params.set("name", quiz.name);
  params.set("q", quiz.query);
  params.set("order", quiz.order);
  params.set("dir", quiz.direction);
  params.set("qty", `${quiz.quantity}`);
  params.set("time", msToTime(quiz.time));
  if (quiz.hints.showColors) params.set("show-colors", "on");
  if (quiz.hints.showCost) params.set("show-cost", "on");
  if (quiz.hints.showIdentity) params.set("show-identity", "on");
  if (quiz.hints.showPriceEur) params.set("show-price-eur", "on");
  if (quiz.hints.showPriceTix) params.set("show-price-tix", "on");
  if (quiz.hints.showPriceUsd) params.set("show-price-usd", "on");
  if (quiz.hints.showStats) params.set("show-stats", "on");
  if (quiz.hints.showTypes) params.set("show-types", "on");
  return params;
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
