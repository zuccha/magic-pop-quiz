import { ScryfallCard } from "@scryfall/api-types";
import { CardSearchDirection } from "./card-search-direction";
import { CardSearchOrder } from "./card-search-order";

export type Quiz = {
  description: string;
  query: string;
  order: CardSearchOrder;
  direction: CardSearchDirection;
  quantity: number;
  time: number;
  cards: ScryfallCard.Any[];
  options: {
    showMana: boolean;
    showSet: boolean;
  };
};
