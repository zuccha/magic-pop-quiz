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

export type CardsSearchOrder = (typeof cardSearchOrders)[number];

export function isCardsSearchOrder(
  maybeCardSearchOrder: unknown,
): maybeCardSearchOrder is CardsSearchOrder {
  return cardSearchOrders.includes(maybeCardSearchOrder as CardsSearchOrder);
}

export function validateCardsSearchOrder(
  maybeCardSearchOrder: unknown,
  defaultCardSearchOrder: CardsSearchOrder = "name",
): CardsSearchOrder {
  return isCardsSearchOrder(maybeCardSearchOrder)
    ? maybeCardSearchOrder
    : defaultCardSearchOrder;
}
