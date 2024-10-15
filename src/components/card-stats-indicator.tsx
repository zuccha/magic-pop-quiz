import { padL } from "../utils";
import "./card-stats-indicator.css";

export type CardStatsIndicatorProps = {
  stats: string;
  size?: number;
};

export default function CardStatsIndicator({
  stats,
  size,
}: CardStatsIndicatorProps) {
  return (
    <div className="CardStatsIndicator">{size ? padL(stats, size) : stats}</div>
  );
}
