import { padL } from "../utils";
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
