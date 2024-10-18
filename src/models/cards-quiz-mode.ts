export const cardsQuizModes = ["free-typing", "slideshow"] as const;

export type CardsQuizMode = (typeof cardsQuizModes)[number];

export function isCardsQuizMode(
  maybeCardsQuizMode: unknown,
): maybeCardsQuizMode is CardsQuizMode {
  return cardsQuizModes.includes(maybeCardsQuizMode as CardsQuizMode);
}

export function validateCardsQuizMode(
  maybeCardsQuizMode: unknown,
  defaultCardsQuizMode: CardsQuizMode = "free-typing",
): CardsQuizMode {
  return isCardsQuizMode(maybeCardsQuizMode)
    ? maybeCardsQuizMode
    : defaultCardsQuizMode;
}

export const formattedCardsQuizMode: Record<CardsQuizMode, string> = {
  "free-typing": "Free Typing",
  "slideshow": "Slideshow",
};

export const cardsQuizModeEncodings = {
  "free-typing": "0",
  "slideshow": "1",
} as const;

export const cardsQuizModeDecodings = {
  "0": "free-typing",
  "1": "slideshow",
} as const;

export type CardsQuizModeEncoding = keyof typeof cardsQuizModeDecodings;
