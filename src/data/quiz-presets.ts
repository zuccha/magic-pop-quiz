import { Quiz } from "../models/quiz";

const edhrecTop100Cards = (description: string, condition: string): Quiz => ({
  description: `EDHREC's Top 100 Cards - ${description}`,
  query: `format:commander ${condition}`,
  order: "edhrec",
  direction: "auto",
  quantity: 100,
  cards: [],
  time: 20 * 60 * 1000,
  options: {
    showMana: false,
    showSet: false,
  },
});

const quizPresets: Quiz[] = [
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
];

export default quizPresets;
