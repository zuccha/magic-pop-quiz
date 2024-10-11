import { CardsQuiz } from "../models/cards-quiz";

const seconds = 1000;
const minutes = 60 * seconds;

const hints = {
  showCost: false,
  showColors: false,
  showIdentity: false,
  showTypes: false,
  showUsd: false,
  showEur: false,
  showTix: false,
  showStats: false,
};

const top30ExpensiveCards = (currency: "eur" | "usd"): CardsQuiz => ({
  name: `30 Most Expensive Cards in Pioneer (${currency.toUpperCase()})`,
  query: `format:pioneer`,
  order: currency,
  direction: "desc",
  quantity: 30,
  time: 10 * minutes,
  hints: { ...hints, showUsd: currency === "usd", showEur: currency === "eur" },
});

const bannedCards = (): CardsQuiz => ({
  name: `Banned Cards in Pioneer`,
  query: `banned:pioneer`,
  order: "name",
  direction: "asc",
  quantity: 0,
  time: 15 * minutes,
  hints: { ...hints, showCost: true },
});

const cardsQuizPioneerPresets: CardsQuiz[] = [
  top30ExpensiveCards("usd"),
  top30ExpensiveCards("eur"),
  bannedCards(),
];

export default cardsQuizPioneerPresets;