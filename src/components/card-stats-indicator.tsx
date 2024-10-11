import "./card-stats-indicator.css";

export type CardStatsIndicatorProps = {
  power: string;
  toughness: string;
  size?: number;
};

export default function CardStatsIndicator({
  power,
  toughness,
  size,
}: CardStatsIndicatorProps) {
  return (
    <div className="CardStatsIndicator">
      {size ? padL(`${power}/${toughness}`, size) : `${power}/${toughness}`}
    </div>
  );
}

function padL(text: string, size: number): string {
  return `${" ".repeat(Math.max(size - text.length, 0))}${text}`;
}
