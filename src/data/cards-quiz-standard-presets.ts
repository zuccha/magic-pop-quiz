import { CardsQuiz } from "../models/cards-quiz";
import { CardsSearchOrder } from "../models/cards-search-order";

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
};

const top30ExpensiveCards = (currency: CardsSearchOrder): CardsQuiz => ({
  name: `30 Most Expensive Cards in Standard (${currency.toUpperCase()})`,
  query: `format:standard`,
  order: currency,
  direction: "desc",
  quantity: 30,
  time: 10 * minutes,
  hints: { ...hints, showUsd: true },
});

const bannedCards = (): CardsQuiz => ({
  name: `Banned Cards in Standard`,
  query: `banned:standard`,
  order: "name",
  direction: "asc",
  quantity: 0,
  time: 15 * minutes,
  hints: { ...hints, showCost: true },
});

const cardsQuizStandardPresets: CardsQuiz[] = [
  top30ExpensiveCards("usd"),
  top30ExpensiveCards("eur"),
  bannedCards(),
];

export default cardsQuizStandardPresets;
