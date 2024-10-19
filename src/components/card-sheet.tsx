import { ReactNode, useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { Card, CardFace } from "../models/card";
import { isListWithAtLeastOneItem } from "../utils";
import CardCostsIndicator from "./card-costs-indicator";
import CardRarityIndicator from "./card-rarity-indicator";
import CardSymbol from "./card-symbol";
import "./card-sheet.css";

export type CardSheetProps = {
  card: Card;
  scale?: number;
  showReminder?: boolean;
};

const oracleWithReminderPatterns = [
  { pattern: "\\([^)]+\\)", render: (val: ReactNode) => <i>{val}</i> },
  {
    pattern: "{[^}]+}",
    render: (val: ReactNode) =>
      typeof val === "string" ? <CardSymbol symbol={val} /> : val,
  },
] as const;

const oracleWithoutReminderPatterns = [
  { pattern: "\\([^)]+\\)", render: () => null },
  {
    pattern: "{[^}]+}",
    render: (val: ReactNode) =>
      typeof val === "string" ? <CardSymbol symbol={val} /> : val,
  },
] as const;

const flavorPatterns = [
  {
    pattern: "\\*[^\\*]+\\*",
    render: (val: ReactNode) =>
      typeof val === "string" ? (
        <span className="plain">{val.slice(1, val.length - 1)}</span>
      ) : (
        val
      ),
  },
] as const;

export default function CardSheet({
  card,
  scale = 1,
  showReminder,
}: CardSheetProps) {
  const faces = card.faces.slice(0, 2);
  const fontSize = `calc(1em * ${scale})`;
  const maxWidth = `calc(${faces.length} * 20em + ${faces.length - 1} * 0.5em + 1.5em)`;
  return (
    <div className="CardSheet" style={{ fontSize, maxWidth }}>
      {faces.map((face) => {
        const layout = inferLayout(face);
        const frame = inferFrame(face);
        const isLand = frame === "land";
        const color = inferColor(isLand ? face.identity : face.colors);
        const className = `CardSheet_Face ${layout} ${frame} ${color}`;
        return (
          <div className={className} key={face.nameSanitized}>
            {layout === "regular" ? (
              <CardSheetRegularLayout
                color={color}
                frame={frame}
                showStats={Boolean(face.stats)}
              />
            ) : (
              <CardSheetVerticalLayout color={color} frame={frame} />
            )}

            <CardSheetName face={face} />
            <CardSheetArt card={card} face={face} />
            <CardSheetType face={face} rarity={card.rarity} />
            <CardSheetOracle face={face} showReminder={showReminder} />
            <CardSheetStats face={face} />
            <CardSheetArtist card={card} face={face} />
          </div>
        );
      })}
    </div>
  );
}

function inferColor(colors: string[]): string {
  if (colors.length === 1) return colors[0];
  if (colors.length === 0) return "C";
  return "M";
}

function inferFrame(face: CardFace): string {
  if (face.subtypes.includes("Vehicle")) return "vehicle";
  if (face.types.includes("Land")) return "land";
  if (face.types.includes("Artifact")) return "artifact";
  return "normal";
}

function inferLayout(face: CardFace): string {
  if (face.subtypes.includes("Class")) return "vertical";
  if (face.subtypes.includes("Case")) return "vertical";
  if (face.subtypes.includes("Saga")) return "vertical";
  return "regular";
}

function CardSheetRegularLayout({
  color,
  frame,
  showStats,
}: {
  color: string;
  frame: string;
  showStats: boolean;
}) {
  const bgs = useMemo(() => {
    if (frame === "artifact")
      return color === "C"
        ? {
            frame: `/images/card-template/regular/frame/artifact.png`,
            content: `/images/card-template/regular/content/artifact.png`,
            stats: `/images/card-template/regular/stats/artifact.png`,
          }
        : {
            frame: `/images/card-template/regular/frame/artifact.png`,
            content: `/images/card-template/regular/content/color-${color}.png`,
            stats: `/images/card-template/regular/stats/color-${color}.png`,
          };

    if (frame === "vehicle")
      return color === "C"
        ? {
            frame: `/images/card-template/regular/frame/vehicle.png`,
            content: `/images/card-template/regular/content/artifact.png`,
            stats: `/images/card-template/regular/stats/vehicle.png`,
          }
        : {
            frame: `/images/card-template/regular/frame/vehicle.png`,
            content: `/images/card-template/regular/content/color-${color}.png`,
            stats: `/images/card-template/regular/stats/vehicle.png`,
          };

    if (frame === "land")
      return {
        frame: `/images/card-template/regular/frame/land.png`,
        content: `/images/card-template/regular/content/color-${color}.png`,
        stats: `/images/card-template/regular/stats/color-${color}.png`,
      };

    return {
      frame: `/images/card-template/regular/frame/color-${color}.png`,
      content: `/images/card-template/regular/content/color-${color}.png`,
      stats: `/images/card-template/regular/stats/color-${color}.png`,
    };
  }, [color, frame]);

  return (
    <>
      <img className="CardSheet_BG" src={bgs.frame} />
      <img className="CardSheet_BG" src={bgs.content} />
      {showStats && <img className="CardSheet_FG" src={bgs.stats} />}
    </>
  );
}

function CardSheetVerticalLayout({
  color,
  frame,
}: {
  color: string;
  frame: string;
}) {
  const bg = useMemo(() => {
    if (color !== "C")
      return `/images/card-template/vertical/color-${color}.png`;
    if (frame === "artifact")
      return `/images/card-template/vertical/artifact.png`;
    return `/images/card-template/vertical/land.png`;
  }, [color, frame]);

  return <img className="CardSheet_BG" src={bg} />;
}

function CardSheetName({ face }: { face: CardFace }) {
  const length =
    face.name.length < 20 ? "short" : face.name.length < 25 ? "medium" : "long";
  return (
    <div className={`CardSheet_Name ${length}`}>
      <span>{face.name}</span>
      <CardCostsIndicator costs={[face.cost]} />
    </div>
  );
}

function CardSheetArt({ card, face }: { card: Card; face: CardFace }) {
  const transform = useMemo(() => {
    if (card.layout === "flip") return { 1: "flip" }[face.index];
    if (face.subtypes.includes("Room"))
      return { 0: "room-left", 1: "room-right" }[face.index];
    if (card.keywords.includes("Fuse"))
      return { 0: "fuse-left", 1: "fuse-right" }[face.index];
    if (card.keywords.includes("Aftermath"))
      return { 0: "aftermath-left", 1: "aftermath-right" }[face.index];
    return undefined;
  }, [card.keywords, face.subtypes]);

  const className = transform ? `CardSheet_Art ${transform}` : "CardSheet_Art";

  return (
    <div className={className}>
      {face.art && (
        <img
          src={face.art}
          onLoad={(e) => (e.currentTarget.style.display = "unset")}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </div>
  );
}

function CardSheetType({ face, rarity }: { face: CardFace; rarity: string }) {
  const length =
    face.typeLine.length < 20
      ? "short"
      : face.typeLine.length < 25
        ? "medium"
        : "long";
  return (
    <div className={`CardSheet_Type ${length}`}>
      <span>{face.typeLine}</span>
      <CardRarityIndicator rarity={rarity} />
    </div>
  );
}

function CardSheetOracle({
  face,
  showReminder,
}: {
  face: CardFace;
  showReminder?: boolean;
}) {
  return (
    <div className="CardSheet_Oracle">
      {face.oracle.split("\n").map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>
          <Formatter
            patterns={
              showReminder
                ? oracleWithReminderPatterns
                : oracleWithoutReminderPatterns
            }
            text={paragraph}
          />
        </p>
      ))}

      {face.oracle && face.flavor && <p className="CardSheet_OracleDivider" />}

      {face.flavor && (
        <p>
          <i>
            <Formatter patterns={flavorPatterns} text={face.flavor} />
          </i>
        </p>
      )}
    </div>
  );
}

function CardSheetStats({ face }: { face: CardFace }) {
  return (
    face.stats && (
      <div className="CardSheet_Stats">
        <span>{face.stats}</span>
      </div>
    )
  );
}

function CardSheetSet({ card }: { card: Card }) {
  return <abbr title={card.set.name}>{card.set.code.toUpperCase()}</abbr>;
}

function CardSheetArtist({ card, face }: { card: Card; face: CardFace }) {
  return (
    <span className="CardSheet_Artist">
      <span>
        {card.set.code && face.artist ? (
          <>
            <CardSheetSet card={card} />
            {" — "}
            {face.artist}
          </>
        ) : card.set.code ? (
          <CardSheetSet card={card} />
        ) : (
          face.artist && face.artist
        )}
      </span>

      <span>©{card.releaseYear && ` ${card.releaseYear}`} WotC</span>
    </span>
  );
}

type Pattern = { pattern: string; render: (val: ReactNode) => ReactNode };

function Formatter({
  patterns,
  text,
}: {
  patterns: readonly [Pattern, ...Pattern[]];
  text: string;
}) {
  const [{ pattern, render }, ...rest] = patterns;
  const regex = new RegExp(`(${pattern})`);
  const parts = text.split(regex);

  const renderPart = (part: string) =>
    isListWithAtLeastOneItem(rest) ? (
      <Formatter patterns={rest} text={part} />
    ) : (
      part
    );

  return parts.map((part, i) => (
    <Fragment key={i}>
      {i & 1 ? render(renderPart(part)) : renderPart(part)}
    </Fragment>
  ));
}
