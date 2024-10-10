import "./card-color-indicator.css";

export type CardColorIndicatorProps = {
  colors: string[];
};

export default function CardColorIndicator({
  colors,
}: CardColorIndicatorProps) {
  return (
    <div className="CardColorIndicator">
      {colors.map((color) => (
        <div className={color} key={color} />
      ))}
    </div>
  );
}
