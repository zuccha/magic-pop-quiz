import "./card-types-indicator.css";

export type CardTypesIndicatorProps = {
  types: string[];
  size?: number;
};

export const typeInfos: Record<string, string> = {
  Creature: /*     */ "Cre.",
  Enchantment: /*  */ "Enc.",
  Artifact: /*     */ "Art.",
  Land: /*         */ "Land",
  Battle: /*       */ "Bat.",
  Planeswalker: /* */ "Wal.",
  Instant: /*      */ "Ins.",
  Sorcery: /*      */ "Sor.",
  Kindred: /*      */ "Kin.",
  Plane: /*        */ "Pla.",
  Phenomenon: /*   */ "Phe.",
  Conspiracy: /*   */ "Con.",
  Scheme: /*       */ "Sch.",
  Vanguard: /*     */ "Van.",
};

export default function CardTypesIndicator({
  types,
  size,
}: CardTypesIndicatorProps) {
  return (
    <div className="CardTypesIndicator">
      {types.map((type) => (
        <abbr className="CardTypesIndicator_Chip" title={type}>
          {typeInfos[type] ?? "????"}
        </abbr>
      ))}
      {size && size > types.length && (
        <span>
          {" ".repeat((size - types.length) * 4 + (size - types.length - 1))}
        </span>
      )}
    </div>
  );
}
