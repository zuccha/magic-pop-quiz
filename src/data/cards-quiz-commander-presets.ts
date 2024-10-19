import { CardsQuiz, cardsQuizFromValues } from "../models/cards-quiz";

const seconds = 1000;
const minutes = 60 * seconds;

const bannedCardsFreeTyping = (): CardsQuiz =>
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

const bannedCardsSlideshow = (): CardsQuiz =>
  cardsQuizFromValues({
    name: `Banned Cards in Commander`,
    query: `banned:commander -is:extra -type:conspiracy -oracle:ante`,
    order: "name",
    direction: "asc",
    quantity: 0,
    time: 15 * minutes,
    mode: "slideshow",
    hints: {
      showArtist: true,
      showColors: true,
      showCost: true,
      showFlavor: true,
      showImage: true,
      showOracle: true,
      showRarity: true,
      showReminder: true,
      showSet: true,
      showStats: true,
      showTypes: true,
      showYear: true,
    },
  });

const edhrecTop100CardsFreeTyping = (
  description: string,
  condition: string,
): CardsQuiz =>
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

const edhrecTop100CardsSlideshow = (
  description: string,
  condition: string,
): CardsQuiz =>
  cardsQuizFromValues({
    name: description
      ? `EDHREC's Top 100 Cards - ${description}`
      : "EDHREC's Top 100 Cards",
    query: condition
      ? `format:commander not:reprint ${condition}`
      : "format:commander not:reprint",
    order: "edhrec",
    direction: "asc",
    quantity: 100,
    time: 20 * minutes,
    mode: "slideshow",
    hints: {
      showArtist: true,
      showColors: true,
      showCost: true,
      showFlavor: true,
      showImage: true,
      showOracle: true,
      showRarity: true,
      showReminder: true,
      showSet: true,
      showStats: true,
      showTypes: true,
      showYear: true,
    },
  });

const cardsQuizCommanderPresets: CardsQuiz[] = [
  bannedCardsFreeTyping(),
  bannedCardsSlideshow(),
  edhrecTop100CardsFreeTyping("", ""),
  edhrecTop100CardsSlideshow("", ""),
  edhrecTop100CardsFreeTyping("White", "identity=white"),
  edhrecTop100CardsFreeTyping("Blue", "identity=blue"),
  edhrecTop100CardsFreeTyping("Black", "identity=black"),
  edhrecTop100CardsFreeTyping("Red", "identity=red"),
  edhrecTop100CardsFreeTyping("Green", "identity=green"),
  edhrecTop100CardsFreeTyping("Multicolor", "color=multicolor"),
  edhrecTop100CardsFreeTyping("Creatures", "type:creature"),
  edhrecTop100CardsFreeTyping("Artifacts", "type:artifact"),
  edhrecTop100CardsFreeTyping("Enchantments", "type:enchantment"),
  edhrecTop100CardsFreeTyping("Spells", "type:instant or type:sorcery"),
  edhrecTop100CardsFreeTyping("Lands", "type:land"),
];

export default cardsQuizCommanderPresets;
