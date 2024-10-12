import CardSymbol from "./card-symbol";
import "./card-costs-indicator.css";
import { Fragment } from "react/jsx-runtime";

export type CardCostsIndicatorProps = {
  costs: string[][];
  size?: number;
};

export default function CardCostsIndicator({
  costs,
  size,
}: CardCostsIndicatorProps) {
  const style = size ? { width: `calc(${size}em + ${size - 1}px)` } : undefined;
  return (
    <div className="CardCostsIndicator" style={style}>
      {costs.map((cost, costIndex) => (
        <Fragment key={costIndex}>
          {costIndex !== 0 && <span>//</span>}
          {cost.map((symbol, symbolIndex) => (
            <CardSymbol key={symbolIndex} symbol={symbol} />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
