import { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";
import { CardFace } from "../models/card";
import { isListWithAtLeastOneItem } from "../utils";
import CardCostsIndicator from "./card-costs-indicator";
import CardSymbol from "./card-symbol";
import "./card-sheet.css";

export type CardSheetProps = {
  faces: CardFace[];
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

function inferColor(colors: string[]): string {
  if (colors.length === 1) return colors[0];
  if (colors.length === 0) return "colorless";
  return "gold";
}

export default function CardSheet({
  faces,
  scale = 1,
  showReminder,
}: CardSheetProps) {
  const fontSize = `calc(1em * ${scale})`;
  const maxWidth = `calc(${faces.length} * 20em + ${faces.length - 1} * 0.5em + 1.5em)`;
  return (
    <div className="CardSheet" style={{ fontSize, maxWidth }}>
      {faces.map((face) => (
        <div
          className={`CardSheet_Face ${inferColor(face.colors)}`}
          key={face.nameSanitized}
        >
          <div className="CardSheet_Name">
            <span>{face.name || "\u00A0"}</span>
            <CardCostsIndicator costs={[face.cost]} />
          </div>

          <div className="CardSheet_Art"></div>

          <div className="CardSheet_Type">{face.typeLine || "\u00A0"}</div>

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
            {face.flavor && (
              <p>
                <i>
                  <Formatter patterns={flavorPatterns} text={face.flavor} />
                </i>
              </p>
            )}
          </div>

          {face.stats && <div className="CardSheet_Stats">{face.stats}</div>}

          <span className="CardSheet_Artist">
            <span>
              {face.set.code && face.artist ? (
                <>
                  <abbr title={face.set.name}>
                    {face.set.code.toUpperCase()}
                  </abbr>
                  {" — "}
                  {face.artist}
                </>
              ) : face.set.code ? (
                <abbr title={face.set.name}>{face.set.code.toUpperCase()}</abbr>
              ) : face.artist ? (
                face.artist
              ) : (
                "\u00A0"
              )}
            </span>
          </span>
        </div>
      ))}
    </div>
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
