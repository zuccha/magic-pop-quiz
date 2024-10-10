import { CardsQuiz } from "../models/cards-quiz";

const minutes = 60 * 1000;
const seconds = 1000;

const options = { showMana: false, showSet: false };

const edhrecTop100Cards = (
  description: string,
  condition: string,
): CardsQuiz => ({
  name: description
    ? `EDHREC's Top 100 Cards - ${description}`
    : "EDHREC's Top 100 Cards",
  query: condition ? `format:commander ${condition}` : "format:commander",
  order: "edhrec",
  direction: "auto",
  quantity: 100,
  cards: [],
  time: 20 * minutes,
  options,
});

const modernTop30ExpensiveCards = (): CardsQuiz => ({
  name: `30 Most Expensive Cards in Modern`,
  query: `format:modern`,
  order: "usd",
  direction: "desc",
  quantity: 30,
  cards: [],
  time: 9 * minutes + 59 * seconds,
  options,
});

const quizPresets: CardsQuiz[] = [
  edhrecTop100Cards("", ""),
  edhrecTop100Cards("Colorless", "identity=colorless"),
  edhrecTop100Cards("White", "identity=white"),
  edhrecTop100Cards("Blue", "identity=blue"),
  edhrecTop100Cards("Black", "identity=black"),
  edhrecTop100Cards("Red", "identity=red"),
  edhrecTop100Cards("Green", "identity=green"),
  edhrecTop100Cards("Multicolor", "color=multicolor"),
  edhrecTop100Cards("Artifacts", "type:artifact"),
  edhrecTop100Cards("Enchantments", "type:enchantment"),
  edhrecTop100Cards("Spells", "type:instant or type:sorcery"),
  edhrecTop100Cards("Lands", "type:land"),
  modernTop30ExpensiveCards(),
];

export default quizPresets;
