import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { clamp, padL } from "../utils";
import {
  CardsQuizDirection,
  cardsQuizDirectionDecodings,
  CardsQuizDirectionEncoding,
  cardsQuizDirectionEncodings,
  validateCardsQuizDirection,
} from "./cards-quiz-direction";
import {
  decodeCardsQuizHints,
  encodeCardsQuizHints,
  CardsQuizHints,
} from "./cards-quiz-hints";
import {
  CardsQuizMode,
  cardsQuizModeDecodings,
  CardsQuizModeEncoding,
  cardsQuizModeEncodings,
  validateCardsQuizMode,
} from "./cards-quiz-mode";
import {
  CardsQuizOrder,
  cardsQuizOrderDecodings,
  CardsQuizOrderEncoding,
  cardsQuizOrderEncodings,
  validateCardsQuizOrder,
} from "./cards-quiz-order";
import { timeToMs, seconds, minutes, msToTime } from "./time";

export type CardsQuiz = {
  direction: CardsQuizDirection;
  hints: CardsQuizHints;
  id: string;
  mode: CardsQuizMode;
  name: string;
  order: CardsQuizOrder;
  quantity: number;
  query: string;
  time: number;
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
    mode: validateCardsQuizMode(params.get("mode")),
    hints: {
      showArtist: params.has("show-artist"),
      showColors: params.has("show-colors"),
      showCost: params.has("show-cost"),
      showFlavor: params.has("show-flavor"),
      showIdentity: params.has("show-identity"),
      showImage: params.has("show-image"),
      showOracle: params.has("show-oracle"),
      showPriceEur: params.has("show-price-eur"),
      showPriceTix: params.has("show-price-tix"),
      showPriceUsd: params.has("show-price-usd"),
      showRarity: params.has("show-rarity"),
      showReminder: params.has("show-reminder"),
      showSet: params.has("show-set"),
      showStats: params.has("show-stats"),
      showTypes: params.has("show-types"),
      showYear: params.has("show-year"),
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
  params.set("mode", quiz.mode);
  if (quiz.hints.showArtist) params.set("show-artist", "on");
  if (quiz.hints.showColors) params.set("show-colors", "on");
  if (quiz.hints.showCost) params.set("show-cost", "on");
  if (quiz.hints.showFlavor) params.set("show-flavor", "on");
  if (quiz.hints.showIdentity) params.set("show-identity", "on");
  if (quiz.hints.showImage) params.set("show-image", "on");
  if (quiz.hints.showOracle) params.set("show-oracle", "on");
  if (quiz.hints.showPriceEur) params.set("show-price-eur", "on");
  if (quiz.hints.showPriceTix) params.set("show-price-tix", "on");
  if (quiz.hints.showPriceUsd) params.set("show-price-usd", "on");
  if (quiz.hints.showRarity) params.set("show-rarity", "on");
  if (quiz.hints.showReminder) params.set("show-reminder", "on");
  if (quiz.hints.showSet) params.set("show-set", "on");
  if (quiz.hints.showStats) params.set("show-stats", "on");
  if (quiz.hints.showTypes) params.set("show-types", "on");
  if (quiz.hints.showYear) params.set("show-year", "on");
  return params;
}

export function cardsQuizFromValues(quiz: Omit<CardsQuiz, "id">): CardsQuiz {
  const order = cardsQuizOrderEncodings[quiz.order];
  const direction = cardsQuizDirectionEncodings[quiz.direction];
  const quantity = padL(`${quiz.quantity}`, 3, "0");
  const time = msToTime(quiz.time).replace(":", "");
  const mode = cardsQuizModeEncodings[quiz.mode];
  const hints = encodeCardsQuizHints(quiz.hints);
  const query = compressToEncodedURIComponent(quiz.query);
  const id = `${mode}${order}${direction}${quantity}${time}${hints}${query}`;
  return { ...quiz, id };
}

export function cardsQuizFromId(id: string, name: string): CardsQuiz {
  const mode = id.slice(0, 1) as CardsQuizModeEncoding;
  const order = id.slice(1, 2) as CardsQuizOrderEncoding;
  const dir = id.slice(2, 3) as CardsQuizDirectionEncoding;
  return {
    id,
    name,
    order: cardsQuizOrderDecodings[order] ?? "name",
    direction: cardsQuizDirectionDecodings[dir] ?? "auto",
    quantity: parseInt(id.slice(3, 6)) || 0,
    time: timeToMs(`${id.slice(6, 8)}:${id.slice(8, 10)}`),
    mode: cardsQuizModeDecodings[mode] ?? "free-typing",
    hints: decodeCardsQuizHints(id.slice(10, 14)),
    query: decompressFromEncodedURIComponent(id.slice(14)),
  };
}
