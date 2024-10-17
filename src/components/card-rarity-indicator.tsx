import "./card-rarity-indicator.css";

export type CardRarityIndicatorProps = {
  rarity: string;
};

export default function CardRarityIndicator({
  rarity,
}: CardRarityIndicatorProps) {
  return (
    <div className={`CardRarityIndicator ${rarity}`}>
      <div />
    </div>
  );
}
