import { ScryfallCard } from "@scryfall/api-types";
import { CardsSearchDirection } from "./cards-search-direction";
import { CardsSearchOrder } from "./cards-search-order";

export type CardsQuiz = {
  name: string;
  query: string;
  order: CardsSearchOrder;
  direction: CardsSearchDirection;
  quantity: number;
  time: number;
  cards: ScryfallCard.Any[];
  options: {
    showMana: boolean;
    showSet: boolean;
  };
};
