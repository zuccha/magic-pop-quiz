import { CardsQuiz, cardsQuizFromValues } from "../models/cards-quiz";
import { minutes } from "../models/time";

const top30ExpensiveCards = (currency: "eur" | "usd"): CardsQuiz =>
  cardsQuizFromValues({
    name: `30 Most Expensive Cards in Legacy (${currency.toUpperCase()})`,
    query: `format:legacy`,
    order: currency,
    direction: "desc",
    quantity: 30,
    time: 10 * minutes,
    mode: "free-typing",
    hints: {
      showPriceEur: currency === "eur",
      showPriceUsd: currency === "usd",
    },
  });

const bannedCards = (): CardsQuiz =>
  cardsQuizFromValues({
    name: `Banned Cards in Legacy`,
    query: `banned:legacy -banned:vintage`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 15 * minutes,
    mode: "free-typing",
    hints: { showCost: true },
  });

const cardsQuizLegacyPresets: CardsQuiz[] = [
  top30ExpensiveCards("usd"),
  top30ExpensiveCards("eur"),
  bannedCards(),
];

export default cardsQuizLegacyPresets;
