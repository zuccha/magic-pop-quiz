import { ScryfallCardSymbol, ScryfallList } from "@scryfall/api-types";
import createUseResource from "../hooks/use-resource";

export type CardSymbolInfos = Record<string, ScryfallCardSymbol>;

const useCardSymbolInfos = createUseResource(
  "https://api.scryfall.com/symbology",
  (symbols: ScryfallList.CardSymbols) => {
    const data: CardSymbolInfos = {};
    for (const symbol of symbols.data) data[symbol.symbol] = symbol;
    return data;
  },
);

export default useCardSymbolInfos;
