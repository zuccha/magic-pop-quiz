import { ScryfallCard, ScryfallPrices } from "@scryfall/api-types";
import { typeInfos } from "../components/card-types-indicator";
import { cardSymbolInfosRef } from "../data-hooks/use-card-symbol-infos";
import { sanitize, validateListWithAtLeastOneItem } from "../utils";

export type CardFace = {
  art: string;
  artist: string;
  colors: string[];
  cost: string[];
  flavor?: string;
  identity: string[];
  index: number;
  name: string;
  nameSanitized: string;
  nameSanitizedShort: string;
  oracle: string;
  stats?: string;
  subtypes: string[];
  typeLine: string;
  types: string[];
};

export type Card = {
  colors: string[];
  faces: [CardFace, ...CardFace[]];
  id: string;
  identity: string[];
  imageUrl: string;
  keywords: string[];
  layout: string;
  name: string;
  nameSanitized: string;
  nameSanitizedShort: string;
  price: { eur: string; tix: string; usd: string };
  rarity: string;
  releaseYear: string;
  scryfallUrl: string;
  set: { name: string; code: string };
};

export function cardFromScryfallCard(card: ScryfallCard.Any): Card {
  return "card_faces" in card
    ? {
        colors: parseColors(
          "colors" in card
            ? card.colors
            : card.card_faces.flatMap((face) => face.colors),
        ),
        faces: validateListWithAtLeastOneItem(
          card.card_faces.map((face, i) => ({
            art:
              "image_uris" in face
                ? (face.image_uris?.art_crop ?? "")
                : "image_uris" in card
                  ? (card.image_uris?.art_crop ?? "")
                  : "",
            artist: face.artist ?? "",
            colors: parseColors(
              "colors" in face
                ? face.colors
                : card.layout === "flip" && i === 1
                  ? card.colors
                  : (face.color_indicator ?? inferColors(face.mana_cost ?? "")),
            ),
            cost: parseCost(face.mana_cost ?? ""),
            flavor: face.flavor_text,
            identity: inferIdentity(face.mana_cost ?? "", face.oracle_text),
            index: i,
            name: face.name,
            nameSanitized: sanitize(face.name),
            nameSanitizedShort: sanitize(face.name.split(",")[0]),
            oracle: face.oracle_text,
            stats: parseStats(face),
            subtypes: parseSubtypes(face.type_line),
            typeLine: face.type_line,
            types: parseTypes(face.type_line),
          })),
          blankCardFace,
        ),
        id: card.id,
        identity: parseColors(card.color_identity),
        imageUrl:
          "image_uris" in card
            ? (card.image_uris?.normal ?? "")
            : "image_uris" in card.card_faces[0]
              ? (card.card_faces[0].image_uris?.normal ?? "")
              : "",
        keywords: card.keywords,
        layout: card.layout,
        name: card.name,
        nameSanitized: sanitize(card.name),
        nameSanitizedShort: sanitize(card.name.split(",")[0]),
        price: parsePrice(card.prices),
        rarity: card.rarity,
        releaseYear: `${new Date(card.released_at).getFullYear()}`,
        scryfallUrl: card.uri,
        set: { code: card.set, name: card.set_name },
      }
    : {
        colors: parseColors(card.colors),
        faces: [
          {
            art: card.image_uris?.art_crop ?? "",
            artist: card.artist ?? "",
            colors: parseColors(card.colors),
            cost: parseCost(card.mana_cost),
            flavor: card.flavor_text,
            identity: card.color_identity,
            index: 0,
            name: card.name,
            nameSanitized: sanitize(card.name),
            nameSanitizedShort: sanitize(card.name.split(",")[0]),
            oracle: card.oracle_text,
            stats: parseStats(card),
            subtypes: parseSubtypes(card.type_line),
            typeLine: card.type_line,
            types: parseTypes(card.type_line),
          },
        ],
        id: card.id,
        identity: parseColors(card.color_identity),
        imageUrl: card.image_uris?.normal ?? "",
        keywords: card.keywords,
        layout: card.layout,
        name: card.name,
        nameSanitized: sanitize(card.name),
        nameSanitizedShort: sanitize(card.name.split(",")[0]),
        price: parsePrice(card.prices),
        rarity: card.rarity,
        releaseYear: `${new Date(card.released_at).getFullYear()}`,
        scryfallUrl: card.uri,
        set: { code: card.set, name: card.set_name },
      };
}

export const blankCardFace: CardFace = {
  art: "",
  artist: "",
  colors: [],
  cost: [],
  flavor: undefined,
  identity: [],
  index: 0,
  name: "",
  nameSanitized: "",
  nameSanitizedShort: "",
  oracle: "",
  stats: undefined,
  subtypes: [],
  typeLine: "",
  types: [],
};

export const blankCard: Card = {
  colors: [],
  faces: [blankCardFace],
  id: "",
  identity: [],
  imageUrl: "",
  keywords: [],
  layout: "normal",
  name: "",
  nameSanitized: "",
  nameSanitizedShort: "",
  price: { eur: "", tix: "", usd: "" },
  rarity: "",
  releaseYear: `${new Date().getFullYear()}`,
  scryfallUrl: "",
  set: { code: "", name: "" },
};

const colorSorting: Record<string, number> = { W: 5, U: 4, B: 3, R: 2, G: 1 };
function parseColors(colors: string[]): string[] {
  return [...new Set(colors)].sort((c1, c2) => {
    const score1 = colorSorting[c1] ?? 0;
    const score2 = colorSorting[c2] ?? 0;
    if (score1 > score2) return -1;
    if (score1 < score2) return 1;
    return 0;
  });
}

function parseCost(cost?: string): string[] {
  return cost ? (cost.match(/{[^}]+}/g) ?? []) : [];
}

function parsePrice(prices: ScryfallPrices): Card["price"] {
  return {
    usd: prices.usd ?? prices.usd_foil ?? prices.usd_etched ?? "-",
    eur: prices.eur ?? prices.eur_foil ?? "-",
    tix: prices.tix ?? "-",
  };
}

function parseStats(face: {
  defense?: string;
  loyalty?: string;
  power?: string;
  toughness?: string;
}): string | undefined {
  return (
    face.loyalty ??
    face.defense ??
    (face.power || face.toughness
      ? `${face.power ?? "?"}/${face.toughness ?? "?"}`
      : undefined)
  );
}

function parseSubtypes(typeLine: string): string[] {
  return (typeLine.split("—")[1] || "").trim().split(" ").sort();
}

function parseTypes(typeLine: string): string[] {
  return (typeLine.split("—")[0] || "")
    .trim()
    .split(" ")
    .filter((type) => typeInfos[type])
    .sort();
}

function inferColors(text: string): string[] {
  if (cardSymbolInfosRef.current.status !== "success") return [];

  const info = cardSymbolInfosRef.current.data;
  return [...new Set(parseCost(text).flatMap((symbol) => info[symbol].colors))];
}

function inferIdentity(cost: string, oracle: string): string[] {
  const costColors = inferColors(cost);
  const identityColors = inferColors(oracle);
  return parseColors([...new Set([...costColors, ...identityColors])]);
}
