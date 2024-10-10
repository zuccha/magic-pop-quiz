import { ScryfallCard } from "@scryfall/api-types";
import { CardsSearchDirection } from "./cards-search-direction";
import { CardsSearchOrder } from "./cards-search-order";
import { Hints } from "./hints";

export type CardsQuiz = {
  name: string;
  query: string;
  order: CardsSearchOrder;
  direction: CardsSearchDirection;
  quantity: number;
  time: number;
  cards: ScryfallCard.Any[];
  hints: Hints;
};
