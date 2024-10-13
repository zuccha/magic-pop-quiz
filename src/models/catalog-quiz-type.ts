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

export function isCatalogQuizType(
  maybeCatalogQuizType: unknown,
): maybeCatalogQuizType is CatalogQuizType {
  return catalogQuizTypes.includes(maybeCatalogQuizType as CatalogQuizType);
}

export function validateCatalogQuizType(
  maybeCatalogQuizType: unknown,
  defaultCatalogQuizType: CatalogQuizType,
): CatalogQuizType;

export function validateCatalogQuizType(
  maybeCatalogQuizType: unknown,
): CatalogQuizType | undefined;

export function validateCatalogQuizType(
  maybeCatalogQuizType: unknown,
  defaultCatalogQuizType?: CatalogQuizType,
): CatalogQuizType | undefined {
  return isCatalogQuizType(maybeCatalogQuizType)
    ? maybeCatalogQuizType
    : defaultCatalogQuizType;
}

export const formattedCatalogQuizType: Record<CatalogQuizType, string> = {
  "card-names": "Card Names",
  "artist-names": "Artist Names",
  "word-bank": "Word Bank",
  "supertypes": "Supertypes",
  "card-types": "Card Types",
  "artifact-types": "Artifact Types",
  "battle-types": "Battle Types",
  "creature-types": "Creature Types",
  "enchantment-types": "Enchantment Types",
  "land-types": "Land Types",
  "planeswalker-types": "Planeswalker Types",
  "spell-types": "Spell Types",
  "power": "Power",
  "toughness": "Toughness",
  "loyalties": "Loyalties",
  "keyword-abilities": "Keyword Abilities",
  "keyword-actions": "Keyword Actions",
  "ability-words": "Ability Words",
  "flavor-words": "Flavor Words",
  "watermarks": "Watermarks",
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
