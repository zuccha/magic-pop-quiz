export type Hints = {
  showCost: boolean;
  showColors: boolean;
  showIdentity: boolean;
  showTypes: boolean;
  showUsd: boolean;
  showEur: boolean;
  showTix: boolean;
};

export function formatHints(hints: Hints): string {
  const formattedHints: string[] = [];
  if (hints.showCost) formattedHints.push("cost");
  if (hints.showColors) formattedHints.push("color");
  if (hints.showIdentity) formattedHints.push("identity");
  if (hints.showTypes) formattedHints.push("types");
  if (hints.showUsd) formattedHints.push("usd");
  if (hints.showEur) formattedHints.push("eur");
  if (hints.showTix) formattedHints.push("tix");
  return formattedHints.length > 0 ? formattedHints.join(", ") : "none";
}
