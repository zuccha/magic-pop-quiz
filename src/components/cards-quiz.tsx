import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTimer, { TimerStatus } from "../hooks/use-timer";
import { Card } from "../models/card";
import { QuizRecord } from "../models/quiz-record";
import { seconds } from "../models/time";
import { sanitize } from "../utils";
import CardColorsIndicator from "./card-colors-indicator";
import CardCostsIndicator from "./card-costs-indicator";
import { updateCardPreview } from "./card-preview";
import CardPriceIndicator from "./card-price-indicator";
import CardStatsIndicator from "./card-stats-indicator";
import CardTypesIndicator from "./card-types-indicator";
import QuizProgress from "./quiz-progress";
import "./cards-quiz.css";

export type CardsQuizProps = {
  cards: Card[];
  duration: number;
  onDone: (pb: QuizRecord) => void;
  showColors?: boolean;
  showCost?: boolean;
  showIdentity?: boolean;
  showPriceEur?: boolean;
  showPriceTix?: boolean;
  showPriceUsd?: boolean;
  showStats?: boolean;
  showTypes?: boolean;
};

export default function CardsQuiz({
  cards,
  duration,
  onDone,
  showColors = false,
  showCost = false,
  showIdentity = false,
  showPriceEur = false,
  showPriceTix = false,
  showPriceUsd = false,
  showStats = false,
  showTypes = false,
}: CardsQuizProps) {
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const timer = useTimer(duration);

  const reset = useCallback(() => {
    timer.reset();
    setGuessed(new Set());
  }, [timer.reset]);

  const maxCostLength = useMemo(
    () =>
      Math.max(
        ...cards.map(
          (card) =>
            card.faces.reduce((sum, f) => sum + f.cost.length, 0) +
            card.faces.length -
            1,
        ),
      ),
    [cards],
  );

  const maxColorsLength = useMemo(
    () => Math.max(...cards.map((card) => card.colors.length)),
    [cards],
  );

  const maxIdentityLength = useMemo(
    () => Math.max(...cards.map((card) => card.identity.length)),
    [cards],
  );

  const maxTypesLength = useMemo(
    () => Math.max(...cards.map((card) => card.faces[0].types.length)),
    [cards],
  );

  const maxUsdLength = useMemo(
    () => Math.max(...cards.map((card) => card.price.usd.length)) + 1,
    [cards],
  );

  const maxEurLength = useMemo(
    () => Math.max(...cards.map((card) => card.price.eur.length)) + 1,
    [cards],
  );

  const maxTixLength = useMemo(
    () => Math.max(...cards.map((card) => card.price.tix.length)),
    [cards],
  );

  const maxStatsLength = useMemo(
    () => Math.max(...cards.map((card) => card.faces[0].stats?.length ?? 0)),
    [cards],
  );

  const checkGuess = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const guess = sanitize(e.currentTarget.value);
      setGuessed((prevGuessed) => {
        const newGuessedAnswers = cards.filter(
          (card) =>
            !prevGuessed.has(card.id) &&
            (card.nameSanitized === guess ||
              card.nameSanitizedShort === guess ||
              card.faces.some((face) => face.nameSanitized === guess) ||
              card.faces.some((face) => face.nameSanitizedShort === guess)),
        );
        if (newGuessedAnswers.length === 0) return prevGuessed;
        if (inputRef.current) inputRef.current.value = "";
        const newGuessed = new Set(prevGuessed);
        newGuessedAnswers.forEach((answer) => newGuessed.add(answer.id));
        if (newGuessed.size === cards.length) timer.stop();
        return newGuessed;
      });
    },
    [cards, timer.stop],
  );

  useEffect(() => {
    if (timer.status === TimerStatus.Stopped) {
      onDone({
        answersGuessed: guessed.size,
        answersTotal: cards.length,
        timeRemaining: timer.remaining,
        date: new Date(),
      });
    }
  }, [cards.length, guessed.size, timer.remaining, timer.status, timer.stop]);

  return (
    <div className="CardsQuiz">
      <div className="CardsQuiz_Info">
        {timer.status === TimerStatus.Ready && (
          <div className="CardsQuiz_Info_Ready">
            <button className="solid" onClick={timer.start}>
              Start
            </button>
          </div>
        )}

        {timer.status === TimerStatus.Running && (
          <div className="CardsQuiz_Info_Running">
            <input
              autoFocus
              name="q"
              onChange={checkGuess}
              placeholder="Answer"
              ref={inputRef}
              spellCheck={false}
            />
            <button onClick={timer.pause}>Pause</button>
            <button onClick={timer.stop} className="danger">
              Give Up
            </button>
          </div>
        )}

        {timer.status === TimerStatus.Paused && (
          <div className="CardsQuiz_Info_Paused">
            <button onClick={timer.resume}>Resume</button>
            <button onClick={timer.stop} className="danger">
              Give Up
            </button>
          </div>
        )}

        {timer.status === TimerStatus.Stopped && (
          <div className="CardsQuiz_Info_Stopped">
            <button className="solid" onClick={reset}>
              Reset
            </button>
          </div>
        )}

        <QuizProgress
          dangerThreshold={15 * seconds}
          guessed={guessed.size}
          time={timer.remaining}
          total={cards.length}
        />
      </div>

      {timer.status === TimerStatus.Paused ? (
        <i>Quiz paused</i>
      ) : (
        <div className="CardsQuiz_Answers">
          {cards.map((card) => (
            <div key={card.id}>
              {showPriceUsd && (
                <div className="CardsQuiz_Answer_Text">
                  <CardPriceIndicator
                    currency="$"
                    price={card.price.usd}
                    size={maxUsdLength}
                  />
                </div>
              )}
              {showPriceEur && (
                <div className="CardsQuiz_Answer_Text">
                  <CardPriceIndicator
                    currency="€"
                    price={card.price.eur}
                    size={maxEurLength}
                  />
                </div>
              )}
              {showPriceTix && (
                <div className="CardsQuiz_Answer_Text">
                  <CardPriceIndicator
                    currency=""
                    price={card.price.tix}
                    size={maxTixLength}
                  />
                </div>
              )}
              {showCost && (
                <div className="CardsQuiz_Answer_Text">
                  <CardCostsIndicator
                    costs={card.faces.map((face) => face.cost)}
                    size={maxCostLength}
                  />
                </div>
              )}
              {showColors && (
                <div className="CardsQuiz_Answer_Box">
                  <CardColorsIndicator
                    colors={card.colors}
                    size={maxColorsLength}
                  />
                </div>
              )}
              {showIdentity && (
                <div className="CardsQuiz_Answer_Box">
                  <CardColorsIndicator
                    colors={card.identity}
                    size={maxIdentityLength}
                  />
                </div>
              )}
              {showTypes && (
                <div className="CardsQuiz_Answer_Text">
                  <CardTypesIndicator
                    types={card.faces[0].types}
                    size={maxTypesLength}
                  />
                </div>
              )}
              {showStats && (
                <div className="CardsQuiz_Answer_Text">
                  <CardStatsIndicator
                    stats={card.faces[0].stats ?? ""}
                    size={maxStatsLength}
                  />
                </div>
              )}

              {guessed.has(card.id) ? (
                <span className="CardsQuiz_Answer_Name success">
                  <a
                    {...updateCardPreview(card.imageUrl)}
                    href={card.scryfallUrl}
                    target="_blank"
                  >
                    {card.name}
                  </a>
                </span>
              ) : timer.status === TimerStatus.Stopped ? (
                <span className="CardsQuiz_Answer_Name failure">
                  <a
                    {...updateCardPreview(card.imageUrl)}
                    className="error"
                    href={card.scryfallUrl}
                    target="_blank"
                  >
                    {card.name}
                  </a>
                </span>
              ) : (
                <span className="CardsQuiz_Answer_Name">&nbsp;</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
