import { CatalogQuiz, catalogQuizFromValues } from "../models/catalog-quiz";
import { minutes, seconds } from "../models/time";

const catalogQuizPresets: CatalogQuiz[] = [
  catalogQuizFromValues({
    name: "Supertypes",
    types: ["supertypes"],
    time: 5 * minutes,
  }),
  catalogQuizFromValues({
    name: "Card Types",
    types: ["card-types"],
    time: 5 * minutes,
  }),
  catalogQuizFromValues({
    name: "Artifact Types",
    types: ["artifact-types"],
    time: 7 * minutes + 30 * seconds,
  }),
  catalogQuizFromValues({
    name: "Creature Types",
    types: ["creature-types"],
    time: 25 * minutes,
  }),
  catalogQuizFromValues({
    name: "Enchantment Types",
    types: ["enchantment-types"],
    time: 5 * minutes,
  }),
  catalogQuizFromValues({
    name: "Land Types",
    types: ["land-types"],
    time: 5 * minutes,
  }),
  catalogQuizFromValues({
    name: "Planeswalker Types",
    types: ["planeswalker-types"],
    time: 15 * minutes,
  }),
  catalogQuizFromValues({
    name: "Spell Types",
    types: ["spell-types"],
    time: 5 * minutes,
  }),
  catalogQuizFromValues({
    name: "Keywords (Abilities)",
    types: ["keyword-abilities"],
    time: 15 * minutes,
  }),
  catalogQuizFromValues({
    name: "Keywords (Actions)",
    types: ["keyword-actions"],
    time: 15 * minutes,
  }),
  catalogQuizFromValues({
    name: "Words (Abilities)",
    types: ["ability-words"],
    time: 15 * minutes,
  }),
  catalogQuizFromValues({
    name: "Keywords and Words",
    types: ["keyword-abilities", "keyword-actions", "ability-words"],
    time: 25 * minutes,
  }),
];

export default catalogQuizPresets;
