const cardSearchOrders = [
  "name",
  "set",
  "released",
  "rarity",
  "color",
  "usd",
  "tix",
  "eur",
  "cmc",
  "power",
  "toughness",
  "edhrec",
  "penny",
  "artist",
  "review",
] as const;

export type CardSearchOrder = (typeof cardSearchOrders)[number];

export function isCardSearchOrder(
  maybeCardSearchOrder: unknown,
): maybeCardSearchOrder is CardSearchOrder {
  return cardSearchOrders.includes(maybeCardSearchOrder as CardSearchOrder);
}

export function validateCardSearchOrder(
  maybeCardSearchOrder: unknown,
  defaultCardSearchOrder: CardSearchOrder = "name",
): CardSearchOrder {
  return isCardSearchOrder(maybeCardSearchOrder)
    ? maybeCardSearchOrder
    : defaultCardSearchOrder;
}
