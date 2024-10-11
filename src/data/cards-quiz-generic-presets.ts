import { CardsQuiz } from "../models/cards-quiz";
import { defaultHints } from "../models/hints";

const seconds = 1000;
const minutes = 60 * seconds;

const hints = defaultHints;

const lands = (title: string, type: string): CardsQuiz => ({
  name: title,
  query: `is:${type}`,
  order: "name",
  direction: "asc",
  quantity: 0,
  time: 5 * minutes,
  hints: { ...hints },
});

const colorShifted = (): CardsQuiz => ({
  name: "Color Shifted",
  query: `is:colorshifted`,
  order: "name",
  direction: "asc",
  quantity: 0,
  time: 10 * minutes,
  hints: { ...hints },
});

const moxes = (): CardsQuiz => ({
  name: "Moxes",
  query: `name:/\\bmox\\b/ -is:extra`,
  order: "name",
  direction: "asc",
  quantity: 0,
  time: 5 * minutes,
  hints: { ...hints },
});

const fatties = (): CardsQuiz => ({
  name: "Fatties: Creatures with 2-digits Power or Toughness",
  query: `power>=10 OR toughness>=10`,
  order: "name",
  direction: "asc",
  quantity: 0,
  time: 15 * minutes,
  hints: { ...hints, showStats: true },
});

const cardsQuizGenericPresets: CardsQuiz[] = [
  lands("Dual Lands", "dual"),
  lands("Fetch Lands", "fetchland"),
  lands("Shock Lands", "shockland"),
  colorShifted(),
  moxes(),
  fatties(),
];

export default cardsQuizGenericPresets;
