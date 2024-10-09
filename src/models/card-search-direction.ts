const cardSearchDirections = ["auto", "asc", "desc"] as const;

export type CardSearchDirection = (typeof cardSearchDirections)[number];

export function isCardSearchDirection(
  maybeCardSearchDirection: unknown,
): maybeCardSearchDirection is CardSearchDirection {
  return cardSearchDirections.includes(
    maybeCardSearchDirection as CardSearchDirection,
  );
}

export function validateCardSearchDirection(
  maybeCardSearchDirection: unknown,
  defaultCardSearchDirection: CardSearchDirection = "auto",
): CardSearchDirection {
  return isCardSearchDirection(maybeCardSearchDirection)
    ? maybeCardSearchDirection
    : defaultCardSearchDirection;
}
