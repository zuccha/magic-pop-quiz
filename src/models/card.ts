import { ScryfallCard, ScryfallPrices } from "@scryfall/api-types";
import { typeInfos } from "../components/card-types-indicator";
import { sanitize, validateListWithAtLeastOneItem } from "../utils";

export type CardFace = {
  artist: string;
  colors: string[];
  cost: string[];
  flavor?: string;
  identity: string[];
  name: string;
  nameSanitized: string;
  nameSanitizedShort: string;
  oracle: string;
  set: { name: string; code: string };
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
  name: string;
  nameSanitized: string;
  nameSanitizedShort: string;
  price: { eur: string; tix: string; usd: string };
  scryfallUrl: string;
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
          card.card_faces.map((face) => ({
            artist: face.artist ?? "",
            colors: parseColors(
              "colors" in face
                ? face.colors
                : inferColors(face.mana_cost ?? ""),
            ),
            cost: parseCost(face.mana_cost ?? ""),
            flavor: face.flavor_text,
            identity: inferIdentity(face.mana_cost ?? "", face.oracle_text),
            name: face.name,
            nameSanitized: sanitize(face.name),
            nameSanitizedShort: sanitize(face.name.split(",")[0]),
            oracle: face.oracle_text,
            set: { code: card.set, name: card.set_name },
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
        name: card.name,
        nameSanitized: sanitize(card.name),
        nameSanitizedShort: sanitize(card.name.split(",")[0]),
        price: parsePrice(card.prices),
        scryfallUrl: card.uri,
      }
    : {
        colors: parseColors(card.colors),
        faces: [
          {
            artist: card.artist ?? "",
            colors: parseColors(card.colors),
            cost: parseCost(card.mana_cost),
            flavor: card.flavor_text,
            identity: card.color_identity,
            name: card.name,
            nameSanitized: sanitize(card.name),
            nameSanitizedShort: sanitize(card.name.split(",")[0]),
            oracle: card.oracle_text,
            set: { code: card.set, name: card.set_name },
            stats: parseStats(card),
            subtypes: parseSubtypes(card.type_line),
            typeLine: card.type_line,
            types: parseTypes(card.type_line),
          },
        ],
        id: card.id,
        identity: parseColors(card.color_identity),
        imageUrl: card.image_uris?.normal ?? "",
        name: card.name,
        nameSanitized: sanitize(card.name),
        nameSanitizedShort: sanitize(card.name.split(",")[0]),
        price: parsePrice(card.prices),
        scryfallUrl: card.uri,
      };
}

export const blankCardFace: CardFace = {
  artist: "",
  colors: [],
  cost: [],
  flavor: undefined,
  identity: [],
  name: "",
  nameSanitized: "",
  nameSanitizedShort: "",
  oracle: "",
  set: { code: "", name: "" },
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
  name: "",
  nameSanitized: "",
  nameSanitizedShort: "",
  price: { eur: "", tix: "", usd: "" },
  scryfallUrl: "",
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
  return (typeLine.split("-")[1] || "").trim().split(" ").sort();
}

function parseTypes(typeLine: string): string[] {
  return (typeLine.split("-")[0] || "")
    .trim()
    .split(" ")
    .filter((type) => typeInfos[type])
    .sort();
}

function inferColors(_cost: string): string[] {
  // TODO.
  return [];
}

function inferIdentity(cost: string, oracle: string): string[] {
  const costColors = inferColors(cost);
  const identityColors = inferColors(oracle);
  return parseColors([...new Set([...costColors, ...identityColors])]);
}
