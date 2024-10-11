export type Hints = {
  showColors: boolean;
  showCost: boolean;
  showIdentity: boolean;
  showPriceEur: boolean;
  showPriceTix: boolean;
  showPriceUsd: boolean;
  showStats: boolean;
  showTypes: boolean;
};

export const defaultHints = {
  showColors: false,
  showCost: false,
  showIdentity: false,
  showPriceEur: false,
  showPriceTix: false,
  showPriceUsd: false,
  showStats: false,
  showTypes: false,
};

export function formatHints(hints: Hints): string {
  const formattedHints: string[] = [];
  if (hints.showColors) formattedHints.push("color");
  if (hints.showCost) formattedHints.push("cost");
  if (hints.showIdentity) formattedHints.push("identity");
  if (hints.showPriceEur) formattedHints.push("eur");
  if (hints.showPriceTix) formattedHints.push("tix");
  if (hints.showPriceUsd) formattedHints.push("usd");
  if (hints.showStats) formattedHints.push("stats");
  if (hints.showTypes) formattedHints.push("types");
  return formattedHints.length > 0 ? formattedHints.join(", ") : "none";
}
