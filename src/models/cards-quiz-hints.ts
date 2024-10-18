import { padL } from "../utils";

export type CardsQuizHints = {
  showArtist?: boolean;
  showColors?: boolean;
  showCost?: boolean;
  showFlavor?: boolean;
  showIdentity?: boolean;
  showImage?: boolean;
  showOracle?: boolean;
  showPriceEur?: boolean;
  showPriceTix?: boolean;
  showPriceUsd?: boolean;
  showRarity?: boolean;
  showReminder?: boolean;
  showSet?: boolean;
  showStats?: boolean;
  showTypes?: boolean;
  showYear?: boolean;
};

export function formatCardsQuizHints(hints: CardsQuizHints): string {
  const formattedHints: string[] = [];
  if (hints.showArtist) formattedHints.push("Artist");
  if (hints.showColors) formattedHints.push("Color");
  if (hints.showCost) formattedHints.push("Cost");
  if (hints.showFlavor) formattedHints.push("Flavor");
  if (hints.showIdentity) formattedHints.push("Identity");
  if (hints.showImage) formattedHints.push("Image");
  if (hints.showOracle) formattedHints.push("Oracle");
  if (hints.showPriceEur) formattedHints.push("EUR");
  if (hints.showPriceTix) formattedHints.push("TIX");
  if (hints.showPriceUsd) formattedHints.push("USD");
  if (hints.showRarity) formattedHints.push("Rarity");
  if (hints.showReminder) formattedHints.push("Reminder");
  if (hints.showSet) formattedHints.push("Set");
  if (hints.showStats) formattedHints.push("Stats");
  if (hints.showTypes) formattedHints.push("Types");
  if (hints.showYear) formattedHints.push("Year");
  return formattedHints.length > 0 ? formattedHints.join(", ") : "None";
}

const orderedHints: (keyof CardsQuizHints)[] = [
  "showArtist",
  "showColors",
  "showCost",
  "showFlavor",
  "showIdentity",
  "showImage",
  "showOracle",
  "showPriceEur",
  "showPriceTix",
  "showPriceUsd",
  "showRarity",
  "showReminder",
  "showSet",
  "showStats",
  "showTypes",
  "showYear",
] as const;

export function encodeCardsQuizHints(hints: CardsQuizHints): string {
  let value = 0;
  for (let i = 0; i < orderedHints.length; ++i)
    value |= Number(hints[orderedHints[i]]) << i;
  return padL(value.toString(26), 4, "0");
}

export function decodeCardsQuizHints(encoded: string): CardsQuizHints {
  const hints: CardsQuizHints = {};
  const value = parseInt(encoded, 26) || 0;
  for (let i = 0; i < orderedHints.length; ++i)
    if (value & (1 << i)) hints[orderedHints[i]] = true;
  return hints;
}
