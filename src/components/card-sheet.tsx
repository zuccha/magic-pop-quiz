import { ReactNode, useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { Card, CardFace } from "../models/card";
import { isListWithAtLeastOneItem } from "../utils";
import CardCostsIndicator from "./card-costs-indicator";
import CardSymbol from "./card-symbol";
import "./card-sheet.css";

export type CardSheetProps = {
  card: Card;
  scale?: number;
  showReminder: boolean;
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
            <CardSheetArt face={face} />
            <CardSheetType face={face} rarity={card.rarity} />
            <CardSheetOracle face={face} showReminder={showReminder} />
            <CardSheetStats face={face} />
            <CardSheetArtist face={face} />
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
  return (
    <div className="CardSheet_Name">
      <span>{face.name || "\u00A0"}</span>
      <CardCostsIndicator costs={[face.cost]} />
    </div>
  );
}

function CardSheetArt({ face }: { face: CardFace }) {
  return (
    <img
      className="CardSheet_Art"
      src={face.artCrop}
      onLoad={(e) => (e.currentTarget.style.display = "unset")}
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}

function CardSheetType({ face, rarity }: { face: CardFace; rarity: string }) {
  return (
    <div className="CardSheet_Type">
      <span>{face.typeLine || "\u00A0"}</span>
      <div className={`CardSheet_Rarity ${rarity}`} />
    </div>
  );
}

function CardSheetOracle({
  face,
  showReminder,
}: {
  face: CardFace;
  showReminder: boolean;
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

function CardSheetSet({ face }: { face: CardFace }) {
  return <abbr title={face.set.name}>{face.set.code.toUpperCase()}</abbr>;
}

function CardSheetArtist({ face }: { face: CardFace }) {
  return (
    <span className="CardSheet_Artist">
      <span>
        {face.set.code && face.artist ? (
          <>
            <CardSheetSet face={face} />
            {" — "}
            {face.artist}
          </>
        ) : face.set.code ? (
          <CardSheetSet face={face} />
        ) : face.artist ? (
          face.artist
        ) : (
          "\u00A0"
        )}
      </span>
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
