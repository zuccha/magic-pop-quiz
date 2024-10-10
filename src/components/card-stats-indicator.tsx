import "./card-price-indicator.css";

export type CardPriceIndicatorProps = {
  power: string;
  toughness: string;
  size?: number;
};

export default function CardPriceIndicator({
  power,
  toughness,
  size,
}: CardPriceIndicatorProps) {
  return (
    <div className="CardPriceIndicator">
      {size ? padL(`${power}/${toughness}`, size) : `${power}/${toughness}`}
    </div>
  );
}

function padL(text: string, size: number): string {
  return `${" ".repeat(Math.max(size - text.length, 0))}${text}`;
}
