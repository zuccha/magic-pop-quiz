import { ScryfallCardSymbol, ScryfallList } from "@scryfall/api-types";
import {
  createUseResourceScryfall,
  scryfallUrl,
} from "../hooks/use-resource-scryfall";

export type CardSymbolInfos = Record<string, ScryfallCardSymbol>;

const cardSymbolInfosContext = createUseResourceScryfall(
  scryfallUrl("/symbology"),
  (symbols: ScryfallList.CardSymbols) => {
    const data: CardSymbolInfos = {};
    for (const symbol of symbols.data) data[symbol.symbol] = symbol;
    return data;
  },
);

export const cardSymbolInfosRef = cardSymbolInfosContext.resourceRef;
export const fetchCardSymbolInfos = cardSymbolInfosContext.fetchResource;

const useCardSymbolInfos = cardSymbolInfosContext.useResource;
export default useCardSymbolInfos;
