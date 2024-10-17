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
  "free-typing": "00",
  "slideshow": "01",
} as const;

export const cardsQuizModeDecodings = {
  "00": "free-typing",
  "01": "slideshow",
} as const;

export type CardsQuizModeEncoding = keyof typeof cardsQuizModeDecodings;
