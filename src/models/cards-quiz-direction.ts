export const cardsQuizDirections = ["auto", "asc", "desc"] as const;

export type CardsQuizDirection = (typeof cardsQuizDirections)[number];

export function isCardsQuizDirection(
  maybeCardsQuizDirection: unknown,
): maybeCardsQuizDirection is CardsQuizDirection {
  return cardsQuizDirections.includes(
    maybeCardsQuizDirection as CardsQuizDirection,
  );
}

export function validateCardsQuizDirection(
  maybeCardsQuizDirection: unknown,
  defaultCardsQuizDirection: CardsQuizDirection = "auto",
): CardsQuizDirection {
  return isCardsQuizDirection(maybeCardsQuizDirection)
    ? maybeCardsQuizDirection
    : defaultCardsQuizDirection;
}

export const formattedCardsQuizDirection: Record<CardsQuizDirection, string> = {
  auto: "Auto",
  asc: "Asc",
  desc: "Desc",
};

export const cardsQuizDirectionEncodings = {
  auto: "0",
  asc: "1",
  desc: "2",
} as const;

export const cardsQuizDirectionDecodings = {
  "0": "auto",
  "1": "asc",
  "2": "desc",
} as const;

export type CardsQuizDirectionEncoding =
  keyof typeof cardsQuizDirectionDecodings;
