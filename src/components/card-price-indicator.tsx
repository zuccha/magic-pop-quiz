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

function padL(text: string, size: number): string {
  return `${" ".repeat(Math.max(size - text.length, 0))}${text}`;
}
