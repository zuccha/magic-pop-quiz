import { useLayoutEffect } from "react";
import { msToTime, timeToMs } from "../models/time";
import useTimer, { TimerStatus } from "../hooks/use-timer";
import {
  formattedCardsSearchOrder,
  validateCardsSearchOrder,
} from "../models/cards-search-order";
import {
  formattedCardsSearchDirection,
  validateCardsSearchDirection,
} from "../models/cards-search-direction";
import "./quiz-page.css";

export default function QuizPage() {
  const params = new URLSearchParams(document.location.search);
  const name = params.get("name") ?? "";
  const query = params.get("q") ?? "";
  const order = validateCardsSearchOrder(params.get("order"));
  const direction = validateCardsSearchDirection(params.get("dir"));
  const quantity = params.get("qty") ?? 100;
  const time = timeToMs(params.get("time") ?? "10:00");
  // const showMana = params.has("show-mana") ?? false;
  // const showSet = params.has("show-set") ?? false;

  const formattedOrder = formattedCardsSearchOrder[order];
  const formattedDirection = formattedCardsSearchDirection[direction];

  const timer = useTimer(time);

  useLayoutEffect(() => {
    // const url = new URL("https://api.scryfall.com/cards/search");
    // url.searchParams.set("q", query);
    // url.searchParams.set("order", order);
    // url.searchParams.set("dir", direction);
    // const response: ScryfallList.Cards = await (await fetch(url)).json();
    // const cards = response.data;
  }, [query, order, direction]);

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

        <h2>0/{quantity}</h2>
        <h2>{msToTime(timer.remaining)}</h2>
      </div>
    </div>
  );
}
