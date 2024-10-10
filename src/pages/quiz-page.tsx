import { ScryfallList } from "@scryfall/api-types";
import { useLayoutEffect, useState } from "react";
import answerPresets from "../data/answer-presets";
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
import CardSymbol from "../components/card-symbol";

export type Answer = {
  id: string;
  name: string;
  simpleName: string;
  set: string;
  cost: string[];
  image: string;
  type: string;
  guessed: boolean;
};

export default function QuizPage() {
  const [answers, setAnswers] = useState<Answer[]>(answerPresets);

  const params = new URLSearchParams(document.location.search);
  const name = params.get("name") ?? "";
  const query = params.get("q") ?? "";
  const order = validateCardsSearchOrder(params.get("order"));
  const direction = validateCardsSearchDirection(params.get("dir"));
  const quantity = parseInt(params.get("qty") ?? "0") || 0;
  const time = timeToMs(params.get("time") ?? "10:00");
  const showCost = params.has("show-cost") ?? false;
  // const showColor = params.has("show-color") ?? false;
  // const showTypes = params.has("show-types") ?? false;

  const formattedOrder = formattedCardsSearchOrder[order];
  const formattedDirection = formattedCardsSearchDirection[direction];

  const timer = useTimer(time);

  const guessedCount = answers.reduce(
    (count, answer) => count + Number(answer.guessed),
    0,
  );

  const maxCostLength = Math.max(...answers.map((a) => a.cost.length));
  const costWidth = `${maxCostLength + 1}em`;

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
            cost: (card.mana_cost ?? "").match(/{[^}]+}/g) || [],
            image:
              "card_faces" in card && "image_uris" in card.card_faces[0]
                ? card.card_faces[0].image_uris?.normal || ""
                : "image_uris" in card
                  ? card.image_uris?.normal || ""
                  : "",
            type:
              "card_faces" in card
                ? (card.card_faces[0]?.type_line.split("-")[0] || "").trim()
                : (card.type_line.split("-")[0] || "").trim(),
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
            {showCost && (
              <span
                className="QuizPage_Answer_Cost"
                style={{ width: costWidth }}
              >
                {answer.cost.map((symbol, i) => (
                  <CardSymbol key={i} symbol={symbol} />
                ))}
              </span>
            )}
            <span className="QuizPage_Answer_Name">{answer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
