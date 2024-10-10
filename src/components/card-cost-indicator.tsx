import "./card-cost-indicator.css";
import CardSymbol from "./card-symbol";

export type CardCostIndicatorProps = {
  cost: string[];
  size?: number;
};

export default function CardCostIndicator({
  cost,
  size,
}: CardCostIndicatorProps) {
  const style = size ? { width: `calc(${size}em + ${size - 1}px)` } : undefined;
  return (
    <div className="CardCostIndicator" style={style}>
      {cost.map((symbol, i) =>
        symbol === "//" ? (
          <span className="CardCostIndicator_Divider" key={symbol}>
            //
          </span>
        ) : (
          <CardSymbol key={i} symbol={symbol} />
        ),
      )}
    </div>
  );
}
