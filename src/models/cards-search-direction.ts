const cardSearchDirections = ["auto", "asc", "desc"] as const;

export type CardsSearchDirection = (typeof cardSearchDirections)[number];

export function isCardsSearchDirection(
  maybeCardSearchDirection: unknown,
): maybeCardSearchDirection is CardsSearchDirection {
  return cardSearchDirections.includes(
    maybeCardSearchDirection as CardsSearchDirection,
  );
}

export function validateCardsSearchDirection(
  maybeCardSearchDirection: unknown,
  defaultCardSearchDirection: CardsSearchDirection = "auto",
): CardsSearchDirection {
  return isCardsSearchDirection(maybeCardSearchDirection)
    ? maybeCardSearchDirection
    : defaultCardSearchDirection;
}
