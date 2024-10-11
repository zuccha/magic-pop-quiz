import { padL } from "../utils";
import "./card-price-indicator.css";

export type CardPriceIndicatorProps = {
  currency: string;
  price: string;
  size?: number;
};

export default function CardPriceIndicator({
  currency,
  price,
  size,
}: CardPriceIndicatorProps) {
  return (
    <div className="CardPriceIndicator">
      {size ? padL(`${currency}${price}`, size) : `${currency}${price}`}
    </div>
  );
}
