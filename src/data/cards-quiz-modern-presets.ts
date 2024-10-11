import { CardsQuiz, cardsQuizFromValues } from "../models/cards-quiz";
import { minutes } from "../models/time";

const top30ExpensiveCards = (currency: "eur" | "usd"): CardsQuiz =>
  cardsQuizFromValues({
    name: `30 Most Expensive Cards in Modern (${currency.toUpperCase()})`,
    query: `format:modern`,
    order: currency,
    direction: "desc",
    quantity: 30,
    time: 10 * minutes,
    hints: {
      showPriceEur: currency === "eur",
      showPriceUsd: currency === "usd",
    },
  });

const bannedCards = (): CardsQuiz =>
  cardsQuizFromValues({
    name: `Banned Cards in Modern`,
    query: `banned:modern`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 15 * minutes,
    hints: { showCost: true },
  });

const cardsQuizModernPresets: CardsQuiz[] = [
  top30ExpensiveCards("usd"),
  top30ExpensiveCards("eur"),
  bannedCards(),
];

export default cardsQuizModernPresets;
