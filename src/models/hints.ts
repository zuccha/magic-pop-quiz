export type Hints = {
  showColors?: boolean;
  showCost?: boolean;
  showIdentity?: boolean;
  showPriceEur?: boolean;
  showPriceTix?: boolean;
  showPriceUsd?: boolean;
  showStats?: boolean;
  showTypes?: boolean;
};

export function formatHints(hints: Hints): string {
  const formattedHints: string[] = [];
  if (hints.showColors) formattedHints.push("Color");
  if (hints.showCost) formattedHints.push("Cost");
  if (hints.showIdentity) formattedHints.push("Identity");
  if (hints.showPriceEur) formattedHints.push("EUR");
  if (hints.showPriceTix) formattedHints.push("TIX");
  if (hints.showPriceUsd) formattedHints.push("USD");
  if (hints.showStats) formattedHints.push("Stats");
  if (hints.showTypes) formattedHints.push("Types");
  return formattedHints.length > 0 ? formattedHints.join(", ") : "None";
}

export function encodeHints(hints: Hints): string {
  return [
    hints.showColors,
    hints.showCost,
    hints.showIdentity,
    hints.showPriceEur,
    hints.showPriceTix,
    hints.showPriceUsd,
    hints.showStats,
    hints.showTypes,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]
    .map((hint) => (hint ? "t" : "f"))
    .join("");
}

export function decodeHints(encoded: string): Hints {
  const hints: Hints = {};
  if (encoded.charAt(0) === "t") hints.showColors = true;
  if (encoded.charAt(1) === "t") hints.showCost = true;
  if (encoded.charAt(2) === "t") hints.showIdentity = true;
  if (encoded.charAt(3) === "t") hints.showPriceEur = true;
  if (encoded.charAt(4) === "t") hints.showPriceTix = true;
  if (encoded.charAt(5) === "t") hints.showPriceUsd = true;
  if (encoded.charAt(6) === "t") hints.showStats = true;
  if (encoded.charAt(7) === "t") hints.showTypes = true;
  return hints;
}
