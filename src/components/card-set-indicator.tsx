import "./card-set-indicator.css";

export type CardSetIndicatorProps = {
  set: { code: string; name: string };
};

export default function CardSetIndicator({ set }: CardSetIndicatorProps) {
  return (
    <abbr className="CardSetIndicator" title={set.name}>
      {set.code}
    </abbr>
  );
}
