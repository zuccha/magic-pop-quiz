import { CardsQuiz, cardsQuizFromValues } from "../models/cards-quiz";
import { minutes } from "../models/time";

const top30ExpensiveCards = (currency: "eur" | "usd"): CardsQuiz =>
  cardsQuizFromValues({
    name: `30 Most Expensive Cards in Vintage (${currency.toUpperCase()})`,
    query: `format:vintage`,
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
    name: `Restricted Cards in Vintage`,
    query: `restricted:vintage`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 15 * minutes,
    hints: { showCost: true },
  });

const cardsQuizVintagePresets: CardsQuiz[] = [
  top30ExpensiveCards("usd"),
  top30ExpensiveCards("eur"),
  bannedCards(),
];

export default cardsQuizVintagePresets;
