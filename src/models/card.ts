import { ScryfallCard } from "@scryfall/api-types";
import { sanitize } from "../utils";

export type CardFace = {
  artist: string;
  colors: string[];
  cost: string[];
  flavor?: string;
  name: string;
  nameSanitized: string;
  nameSanitizedShort: string;
  oracle: string;
  set: { name: string; code: string };
  stats?: string;
  type: string;
};

export type Card = {
  faces: CardFace[];
  identity: string[];
  name: string;
  nameSanitized: string;
  nameSanitizedShort: string;
  scryfall: string;
};

export function cardFromScryfallCard(card: ScryfallCard.Any): Card {
  return "card_faces" in card
    ? {
        faces: card.card_faces.map((face) => ({
          artist: face.artist ?? "",
          colors:
            "colors" in face
              ? face.colors
              : "colors" in card
                ? card.colors
                : [],
          cost: face.mana_cost
            ? splitCardCosts(face.mana_cost)
            : splitCardCosts(card.mana_cost),
          flavor: face.flavor_text,
          name: face.name,
          nameSanitized: sanitize(face.name),
          nameSanitizedShort: sanitize(face.name.split(",")[0]),
          oracle: face.oracle_text,
          set: {
            code: card.set,
            name: card.set_name,
          },
          stats:
            (face.loyalty ?? face.defense ?? (face.power || face.toughness))
              ? `${face.power ?? "?"}/${face.toughness ?? "?"}`
              : undefined,
          type: face.type_line,
        })),
        identity: card.color_identity,
        name: card.name,
        nameSanitized: sanitize(card.name),
        nameSanitizedShort: sanitize(card.name.split(",")[0]),
        scryfall: card.uri,
      }
    : {
        faces: [
          {
            artist: card.artist ?? "",
            colors: card.colors,
            cost: splitCardCosts(card.mana_cost),
            flavor: card.flavor_text,
            name: card.name,
            nameSanitized: sanitize(card.name),
            nameSanitizedShort: sanitize(card.name.split(",")[0]),
            oracle: card.oracle_text,
            set: {
              code: card.set,
              name: card.set_name,
            },
            stats:
              (card.loyalty ?? card.defense ?? (card.power || card.toughness))
                ? `${card.power ?? "?"}/${card.toughness ?? "?"}`
                : undefined,
            type: card.type_line,
          },
        ],
        identity: card.color_identity,
        name: card.name,
        nameSanitized: sanitize(card.name),
        nameSanitizedShort: sanitize(card.name.split(",")[0]),
        scryfall: card.uri,
      };
}

export function splitCardCosts(cost?: string): string[] {
  return cost ? (cost.match(/{[^}]+}/g) ?? []) : [];
}
