export const cardsQuizOrders = [
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

export type CardsQuizOrder = (typeof cardsQuizOrders)[number];

export function isCardsQuizOrder(
  maybeCardsQuizOrder: unknown,
): maybeCardsQuizOrder is CardsQuizOrder {
  return cardsQuizOrders.includes(maybeCardsQuizOrder as CardsQuizOrder);
}

export function validateCardsQuizOrder(
  maybeCardsQuizOrder: unknown,
  defaultCardsQuizOrder: CardsQuizOrder = "name",
): CardsQuizOrder {
  return isCardsQuizOrder(maybeCardsQuizOrder)
    ? maybeCardsQuizOrder
    : defaultCardsQuizOrder;
}

export const formattedCardsQuizOrder: Record<CardsQuizOrder, string> = {
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

export const cardsQuizOrderEncodings = {
  name: "0",
  released: "1",
  set: "2",
  rarity: "3",
  color: "5",
  usd: "6",
  tix: "7",
  eur: "8",
  cmc: "9",
  power: "A",
  toughness: "B",
  artist: "C",
  edhrec: "D",
  review: "E",
} as const;

export const cardsQuizOrderDecodings = {
  "0": "name",
  "1": "released",
  "2": "set",
  "3": "rarity",
  "5": "color",
  "6": "usd",
  "7": "tix",
  "8": "eur",
  "9": "cmc",
  "A": "power",
  "B": "toughness",
  "C": "artist",
  "D": "edhrec",
  "E": "review",
} as const;

export type CardsQuizOrderEncoding = keyof typeof cardsQuizOrderDecodings;
