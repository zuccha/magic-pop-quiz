import { ScryfallList } from "@scryfall/api-types";
import { useLayoutEffect, useMemo, useState } from "react";
import CardColorsIndicator from "../components/card-colors-indicator";
import CardCostIndicator from "../components/card-cost-indicator";
import CardPriceIndicator from "../components/card-price-indicator";
// import answerPresets from "../data/answer-presets";
import useTimer, { TimerStatus } from "../hooks/use-timer";
import {
  formattedCardsSearchDirection,
  validateCardsSearchDirection,
} from "../models/cards-search-direction";
import {
  formattedCardsSearchOrder,
  validateCardsSearchOrder,
} from "../models/cards-search-order";
import { msToTime, timeToMs } from "../models/time";
import "./quiz-page.css";

export type Answer = {
  id: string;
  name: string;
  simpleName: string;
  set: string;
  cost: string[];
  identity: string[];
  colors: string[];
  type: string;
  image: string;
  price: {
    usd: string;
    eur: string;
    tix: string;
  };
  guessed: boolean;
};

export default function QuizPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);

  const params = new URLSearchParams(document.location.search);
  const name = params.get("name") ?? "";
  const query = params.get("q") ?? "";
  const order = validateCardsSearchOrder(params.get("order"));
  const direction = validateCardsSearchDirection(params.get("dir"));
  const quantity = parseInt(params.get("qty") ?? "0") || 0;
  const time = timeToMs(params.get("time") ?? "10:00");
  const showCost = params.has("show-cost") ?? false;
  const showColors = params.has("show-colors") ?? false;
  const showIdentity = params.has("show-identity") ?? false;
  // const showTypes = params.has("show-types") ?? false;
  const showUsd = params.has("show-usd") ?? false;
  const showEur = params.has("show-eur") ?? false;
  const showTix = params.has("show-tix") ?? false;

  const formattedOrder = formattedCardsSearchOrder[order];
  const formattedDirection = formattedCardsSearchDirection[direction];

  const timer = useTimer(time);

  const guessedCount = useMemo(
    () => answers.reduce((count, answer) => count + Number(answer.guessed), 0),
    [answers],
  );

  const maxCostLength = useMemo(
    () => Math.max(...answers.map((answer) => answer.cost.length)),
    [answers],
  );

  const maxColorsLength = useMemo(
    () => Math.max(...answers.map((answer) => answer.colors.length)),
    [answers],
  );

  const maxIdentityLength = useMemo(
    () => Math.max(...answers.map((answer) => answer.identity.length)),
    [answers],
  );

  const maxUsdLength = useMemo(
    () => Math.max(...answers.map((answer) => answer.price.usd.length)) + 1,
    [answers],
  );

  const maxEurLength = useMemo(
    () => Math.max(...answers.map((answer) => answer.price.eur.length)) + 1,
    [answers],
  );

  const maxTixLength = useMemo(
    () => Math.max(...answers.map((answer) => answer.price.tix.length)),
    [answers],
  );

  useLayoutEffect(() => {
    const fetchCards = async () => {
      const url = new URL("https://api.scryfall.com/cards/search");
      url.searchParams.set("q", query);
      url.searchParams.set("order", order);
      url.searchParams.set("dir", direction);
      const response: ScryfallList.Cards = await (await fetch(url)).json();
      const cards = response.data;
      setAnswers(
        cards.slice(0, quantity || undefined).map((card) => {
          return {
            id: card.id,
            name: card.name,
            simpleName: card.name,
            set: card.set_name,
            cost: card.mana_cost
              ? (card.mana_cost.match(/{[^}]+}|\/\//g) ?? [])
              : "card_faces" in card
                ? card.card_faces.flatMap(
                    (face) => face.mana_cost?.match(/{[^}]+}|\/\//g) ?? [],
                  )
                : [],
            identity: sortColors(card.color_identity),
            colors: sortColors(
              "colors" in card && card.colors
                ? card.colors
                : "card_faces" in card
                  ? card.card_faces.flatMap((face) =>
                      "colors" in face ? face.colors : [],
                    )
                  : [],
            ),
            type:
              "card_faces" in card
                ? (card.card_faces[0]?.type_line.split("-")[0] || "").trim()
                : (card.type_line.split("-")[0] || "").trim(),
            image:
              "image_uris" in card && card.image_uris
                ? card.image_uris.normal
                : "card_faces" in card &&
                    "image_uris" in card.card_faces[0] &&
                    card.card_faces[0].image_uris
                  ? card.card_faces[0].image_uris.normal
                  : "",
            price: {
              usd:
                card.prices.usd ??
                card.prices.usd_foil ??
                card.prices.usd_etched ??
                "-",
              eur: card.prices.eur ?? card.prices.eur_foil ?? "-",
              tix: card.prices.tix ?? "-",
            },
            guessed: false,
          };
        }),
      );
    };
    fetchCards();
  }, [quantity, query, order, direction]);

  return (
    <div className="QuizPage">
      <div>
        <h1>{name}</h1>
        <span>
          <i>{`${query} | ${formattedOrder}, ${formattedDirection}`}</i>
        </span>
      </div>

      <div className="QuizPage_Info">
        {timer.status === TimerStatus.Ready && (
          <div className="QuizPage_Info_Ready">
            <button onClick={timer.start}>Start</button>
          </div>
        )}

        {timer.status === TimerStatus.Running && (
          <div className="QuizPage_Info_Running">
            <input autoFocus name="q" placeholder="Answer" />
            <button onClick={timer.pause}>Pause</button>
            <button onClick={timer.reset}>Give Up</button>
          </div>
        )}

        {timer.status === TimerStatus.Paused && (
          <div className="QuizPage_Info_Paused">
            <button onClick={timer.resume}>Resume</button>
            <button onClick={timer.reset}>Give Up</button>
          </div>
        )}

        <h2>{`${guessedCount}/${quantity}`}</h2>
        <h2>{msToTime(timer.remaining)}</h2>
      </div>

      <div className="QuizPage_Answers">
        {answers.map((answer) => (
          <div key={answer.id}>
            {showUsd && (
              <div className="QuizPage_Answer_Text">
                <CardPriceIndicator
                  currency="$"
                  price={answer.price.usd}
                  size={maxUsdLength}
                />
              </div>
            )}
            {showEur && (
              <div className="QuizPage_Answer_Text">
                <CardPriceIndicator
                  currency="€"
                  price={answer.price.eur}
                  size={maxEurLength}
                />
              </div>
            )}
            {showTix && (
              <div className="QuizPage_Answer_Text">
                <CardPriceIndicator
                  currency=""
                  price={answer.price.tix}
                  size={maxTixLength}
                />
              </div>
            )}
            {showCost && (
              <div className="QuizPage_Answer_Text">
                <CardCostIndicator cost={answer.cost} size={maxCostLength} />
              </div>
            )}
            {showColors && (
              <CardColorsIndicator
                colors={answer.colors}
                size={maxColorsLength}
              />
            )}
            {showIdentity && (
              <CardColorsIndicator
                colors={answer.identity}
                size={maxIdentityLength}
              />
            )}
            <span className="QuizPage_Answer_Name">{answer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const colorSortingScore: Record<string, number> = {
  W: 5,
  U: 4,
  B: 3,
  R: 2,
  G: 1,
};

function sortColors(colors: string[]): string[] {
  return [...new Set(colors)].sort((c1, c2) => {
    const score1 = colorSortingScore[c1] ?? 0;
    const score2 = colorSortingScore[c2] ?? 0;
    if (score1 > score2) return -1;
    if (score1 < score2) return 1;
    return 0;
  });
}
