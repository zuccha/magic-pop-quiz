import "./card-colors-indicator.css";

export type CardColorsIndicatorProps = {
  colors: string[];
  size?: number;
};

export default function CardColorsIndicator({
  colors,
  size,
}: CardColorsIndicatorProps) {
  const style = size ? { width: `${size * 0.5}em` } : undefined;
  return (
    <div className="CardColorIndicator" style={style}>
      {colors.map((color) => (
        <div className={color} key={color} />
      ))}
    </div>
  );
}
