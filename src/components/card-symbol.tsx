import { useMemo } from "react";
import useCardSymbolInfos from "../data-hooks/use-card-symbol-infos";
import "./card-symbol.css";

export type CardSymbolProps = {
  symbol: string;
};

export default function CardSymbol({ symbol }: CardSymbolProps) {
  const cardSymbolInfos = useCardSymbolInfos();
  if (cardSymbolInfos.status !== "success")
    return <abbr className="CardSymbol">{symbol}</abbr>;

  const [title, style] = useMemo(() => {
    const info =
      cardSymbolInfos.data[symbol as keyof typeof cardSymbolInfos.data];
    return info
      ? [info.english, { backgroundImage: `url(${info.svg_uri})` }]
      : ["", undefined];
  }, [symbol]);

  return (
    <abbr className="CardSymbol" style={style} title={title}>
      {symbol}
    </abbr>
  );
}
