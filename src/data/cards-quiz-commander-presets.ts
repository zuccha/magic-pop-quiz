import { CardsQuiz, cardsQuizFromValues } from "../models/cards-quiz";

const seconds = 1000;
const minutes = 60 * seconds;

const bannedCards = (): CardsQuiz =>
  cardsQuizFromValues({
    name: `Banned Cards in Commander`,
    query: `banned:commander -is:extra -type:conspiracy -oracle:ante`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 15 * minutes,
    mode: "free-typing",
    hints: { showCost: true },
  });

const edhrecTop100Cards = (description: string, condition: string): CardsQuiz =>
  cardsQuizFromValues({
    name: description
      ? `EDHREC's Top 100 Cards - ${description}`
      : "EDHREC's Top 100 Cards",
    query: condition ? `format:commander ${condition}` : "format:commander",
    order: "edhrec",
    direction: "asc",
    quantity: 100,
    time: 20 * minutes,
    mode: "free-typing",
    hints: { showCost: true },
  });

const cardsQuizCommanderPresets: CardsQuiz[] = [
  bannedCards(),
  edhrecTop100Cards("", ""),
  edhrecTop100Cards("White", "identity=white"),
  edhrecTop100Cards("Blue", "identity=blue"),
  edhrecTop100Cards("Black", "identity=black"),
  edhrecTop100Cards("Red", "identity=red"),
  edhrecTop100Cards("Green", "identity=green"),
  edhrecTop100Cards("Multicolor", "color=multicolor"),
  edhrecTop100Cards("Creatures", "type:creature"),
  edhrecTop100Cards("Artifacts", "type:artifact"),
  edhrecTop100Cards("Enchantments", "type:enchantment"),
  edhrecTop100Cards("Spells", "type:instant or type:sorcery"),
  edhrecTop100Cards("Lands", "type:land"),
];

export default cardsQuizCommanderPresets;
