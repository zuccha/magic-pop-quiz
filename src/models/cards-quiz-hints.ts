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

export function encodeCardsQuizHints(hints: CardsQuizHints): string {
  return [
    hints.showColors,
    hints.showCost,
    hints.showIdentity,
    hints.showPriceEur,
    hints.showPriceTix,
    hints.showPriceUsd,
    hints.showStats,
    hints.showTypes,
    hints.showRarity,
    hints.showArtist,
    hints.showSet,
    hints.showYear,
    hints.showImage,
    hints.showOracle,
    hints.showReminder,
    hints.showFlavor,
  ]
    .map((hint) => (hint ? "t" : "f"))
    .join("");
}

export function decodeCardsQuizHints(encoded: string): CardsQuizHints {
  const hints: CardsQuizHints = {};
  if (encoded.charAt(0) === "t") hints.showColors = true;
  if (encoded.charAt(1) === "t") hints.showCost = true;
  if (encoded.charAt(2) === "t") hints.showIdentity = true;
  if (encoded.charAt(3) === "t") hints.showPriceEur = true;
  if (encoded.charAt(4) === "t") hints.showPriceTix = true;
  if (encoded.charAt(5) === "t") hints.showPriceUsd = true;
  if (encoded.charAt(6) === "t") hints.showStats = true;
  if (encoded.charAt(7) === "t") hints.showTypes = true;
  if (encoded.charAt(8) === "t") hints.showRarity = true;
  if (encoded.charAt(9) === "t") hints.showArtist = true;
  if (encoded.charAt(10) === "t") hints.showSet = true;
  if (encoded.charAt(11) === "t") hints.showYear = true;
  if (encoded.charAt(12) === "t") hints.showImage = true;
  if (encoded.charAt(13) === "t") hints.showOracle = true;
  if (encoded.charAt(14) === "t") hints.showReminder = true;
  if (encoded.charAt(15) === "t") hints.showFlavor = true;
  return hints;
}
