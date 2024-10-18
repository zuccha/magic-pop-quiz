import { z } from "zod";

const catalogQuizTypes = [
  "card-names",
  "artist-names",
  "word-bank",
  "supertypes",
  "card-types",
  "artifact-types",
  "battle-types",
  "creature-types",
  "enchantment-types",
  "land-types",
  "planeswalker-types",
  "spell-types",
  "power",
  "toughness",
  "loyalties",
  "keyword-abilities",
  "keyword-actions",
  "ability-words",
  "flavor-words",
  "watermarks",
] as const;

export const CatalogQuizTypeSchema = z.enum(catalogQuizTypes);
export type CatalogQuizType = z.infer<typeof CatalogQuizTypeSchema>;

export function validateCatalogQuizType(
  maybeType: unknown,
  defaultType: CatalogQuizType,
): CatalogQuizType;

export function validateCatalogQuizType(
  maybeType: unknown,
): CatalogQuizType | undefined;

export function validateCatalogQuizType(
  maybeType: unknown,
  defaultType?: CatalogQuizType,
): CatalogQuizType | undefined {
  const result = CatalogQuizTypeSchema.safeParse(maybeType);
  return result.success ? result.data : defaultType;
}

export const formattedCatalogQuizType: Record<CatalogQuizType, string> = {
  "card-names": "Card Name",
  "artist-names": "Artist Name",
  "word-bank": "Word Bank",
  "supertypes": "Supertype",
  "card-types": "Card Type",
  "artifact-types": "Artifact Type",
  "battle-types": "Battle Type",
  "creature-types": "Creature Type",
  "enchantment-types": "Enchantment Type",
  "land-types": "Land Type",
  "planeswalker-types": "Planeswalker Type",
  "spell-types": "Spell Type",
  "power": "Power",
  "toughness": "Toughness",
  "loyalties": "Loyalty",
  "keyword-abilities": "Keyword Ability",
  "keyword-actions": "Keyword Action",
  "ability-words": "Ability Word",
  "flavor-words": "Flavor Word",
  "watermarks": "Watermark",
};

export const catalogQuizTypeEncodings = {
  "card-names": "0",
  "artist-names": "1",
  "word-bank": "2",
  "supertypes": "3",
  "card-types": "4",
  "artifact-types": "5",
  "battle-types": "6",
  "creature-types": "7",
  "enchantment-types": "8",
  "land-types": "9",
  "planeswalker-types": "A",
  "spell-types": "B",
  "power": "C",
  "toughness": "D",
  "loyalties": "E",
  "keyword-abilities": "F",
  "keyword-actions": "G",
  "ability-words": "H",
  "flavor-words": "I",
  "watermarks": "J",
} as const;

export const catalogQuizTypeDecodings = {
  "0": "card-names",
  "1": "artist-names",
  "2": "word-bank",
  "3": "supertypes",
  "4": "card-types",
  "5": "artifact-types",
  "6": "battle-types",
  "7": "creature-types",
  "8": "enchantment-types",
  "9": "land-types",
  "A": "planeswalker-types",
  "B": "spell-types",
  "C": "power",
  "D": "toughness",
  "E": "loyalties",
  "F": "keyword-abilities",
  "G": "keyword-actions",
  "H": "ability-words",
  "I": "flavor-words",
  "J": "watermarks",
} as const;

export type QuizTypeEncoding = keyof typeof catalogQuizTypeDecodings;
