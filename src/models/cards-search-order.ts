export const cardsSearchOrders = [
  "name",
  "released",
  "set",
  "rarity",
  "color",
  "usd",
  "tix",
  "eur",
  "cmc",
  "power",
  "toughness",
  "artist",
  "edhrec",
  "review",
] as const;

export type CardsSearchOrder = (typeof cardsSearchOrders)[number];

export function isCardsSearchOrder(
  maybeCardSearchOrder: unknown,
): maybeCardSearchOrder is CardsSearchOrder {
  return cardsSearchOrders.includes(maybeCardSearchOrder as CardsSearchOrder);
}

export function validateCardsSearchOrder(
  maybeCardSearchOrder: unknown,
  defaultCardSearchOrder: CardsSearchOrder = "name",
): CardsSearchOrder {
  return isCardsSearchOrder(maybeCardSearchOrder)
    ? maybeCardSearchOrder
    : defaultCardSearchOrder;
}

export const formattedCardsSearchOrder: Record<CardsSearchOrder, string> = {
  name: "Name",
  released: "Release Date",
  set: "Set/Number",
  rarity: "Rarity",
  color: "Color",
  usd: "Price: USD",
  tix: "Price: TIX",
  eur: "Price: EUR",
  cmc: "Mana Value",
  power: "Power",
  toughness: "Toughness",
  artist: "Artist Name",
  edhrec: "EDHREC Rank",
  review: "Set Review",
};
