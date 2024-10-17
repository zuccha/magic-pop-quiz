import { padL, padR } from "../utils";
import "./card-text-indicator.css";

export type CardTextIndicatorProps = {
  padding?: "left" | "right";
  size?: number;
  text: string;
};

export default function CardTextIndicator({
  padding = "left",
  size,
  text,
}: CardTextIndicatorProps) {
  return (
    <div className="CardTextIndicator">
      {size
        ? padding === "right"
          ? padR(text, size)
          : padL(text, size)
        : text}
    </div>
  );
}
