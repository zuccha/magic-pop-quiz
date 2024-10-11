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

export const cardsSearchOrderEncodings = {
  name: "00",
  released: "01",
  set: "02",
  rarity: "03",
  color: "05",
  usd: "06",
  tix: "07",
  eur: "08",
  cmc: "09",
  power: "10",
  toughness: "11",
  artist: "12",
  edhrec: "13",
  review: "14",
} as const;

export const cardsSearchOrderDecodings = {
  "00": "name",
  "01": "released",
  "02": "set",
  "03": "rarity",
  "05": "color",
  "06": "usd",
  "07": "tix",
  "08": "eur",
  "09": "cmc",
  "10": "power",
  "11": "toughness",
  "12": "artist",
  "13": "edhrec",
  "14": "review",
} as const;
