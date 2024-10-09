export const cardsSearchDirections = ["auto", "asc", "desc"] as const;

export type CardsSearchDirection = (typeof cardsSearchDirections)[number];

export function isCardsSearchDirection(
  maybeCardSearchDirection: unknown,
): maybeCardSearchDirection is CardsSearchDirection {
  return cardsSearchDirections.includes(
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

export const formattedCardsSearchDirection: Record<
  CardsSearchDirection,
  string
> = {
  auto: "Auto",
  asc: "Asc",
  desc: "Desc",
};
