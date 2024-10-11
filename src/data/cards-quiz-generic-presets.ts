import { CardsQuiz, cardsQuizFromValues } from "../models/cards-quiz";
import { minutes } from "../models/time";

const lands = (title: string, type: string): CardsQuiz =>
  cardsQuizFromValues({
    name: title,
    query: `is:${type}`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 5 * minutes,
    hints: {},
  });

const colorShifted = (): CardsQuiz =>
  cardsQuizFromValues({
    name: "Color Shifted",
    query: `is:colorshifted`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 10 * minutes,
    hints: {},
  });

const moxes = (): CardsQuiz =>
  cardsQuizFromValues({
    name: "Moxes",
    query: `name:/\\bmox\\b/ -is:extra`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 5 * minutes,
    hints: {},
  });

const fatties = (): CardsQuiz =>
  cardsQuizFromValues({
    name: "Fatties: Creatures with 2-digits Power or Toughness",
    query: `power>=10 OR toughness>=10`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 15 * minutes,
    hints: { showStats: true },
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
