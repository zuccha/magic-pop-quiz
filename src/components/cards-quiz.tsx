import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTimer, { TimerStatus } from "../hooks/use-timer";
import { CardsQuizAnswer } from "../models/cards-quiz-answer";
import { CardsQuizPB } from "../models/cards-quiz-pb";
import CardColorsIndicator from "./card-colors-indicator";
import CardCostIndicator from "./card-cost-indicator";
import { updateCardPreview } from "./card-preview";
import CardPriceIndicator from "./card-price-indicator";
import CardStatsIndicator from "./card-stats-indicator";
import CardTypesIndicator from "./card-types-indicator";
import QuizProgress from "./quiz-progress";
import "./cards-quiz.css";

export type CardsQuizProps = {
  answers: CardsQuizAnswer[];
  duration: number;
  onDone: (pb: CardsQuizPB) => void;
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
  answers,
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

  const maxTypesLength = useMemo(
    () => Math.max(...answers.map((answer) => answer.types.length)),
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

  const maxStatsLength = useMemo(
    () =>
      Math.max(
        ...answers.map(
          (answer) =>
            answer.stats.power.length + answer.stats.toughness.length + 1,
        ),
      ),
    [answers],
  );

  const checkGuess = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const guess = e.currentTarget.value
        .normalize("NFD")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .trim();
      setGuessed((prevGuessed) => {
        const newGuessedAnswers = answers.filter(
          (answer) =>
            !prevGuessed.has(answer.id) &&
            (answer.simpleName === guess ||
              answer.simpleShortName === guess ||
              answer.simpleNames.some((name) => name === guess) ||
              answer.simpleShortNames.some((name) => name === guess)),
        );
        if (newGuessedAnswers.length === 0) return prevGuessed;
        if (inputRef.current) inputRef.current.value = "";
        const newGuessed = new Set(prevGuessed);
        newGuessedAnswers.forEach((answer) => newGuessed.add(answer.id));
        if (newGuessed.size === answers.length) timer.stop();
        return newGuessed;
      });
    },
    [answers, timer.stop],
  );

  useEffect(() => {
    if (timer.status === TimerStatus.Stopped) {
      onDone({
        answersGuessed: guessed.size,
        timeRemaining: timer.remaining,
        date: new Date(),
      });
    }
  }, [guessed.size, timer.remaining, timer.status, timer.stop]);

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
          dangerThreshold={15 * 1000}
          guessed={guessed.size}
          time={timer.remaining}
          total={answers.length}
        />
      </div>

      {timer.status === TimerStatus.Paused ? (
        <i>Quiz paused</i>
      ) : (
        <div className="CardsQuiz_Answers">
          {answers.map((answer) => (
            <div key={answer.id}>
              {showPriceUsd && (
                <div className="CardsQuiz_Answer_Text">
                  <CardPriceIndicator
                    currency="$"
                    price={answer.price.usd}
                    size={maxUsdLength}
                  />
                </div>
              )}
              {showPriceEur && (
                <div className="CardsQuiz_Answer_Text">
                  <CardPriceIndicator
                    currency="€"
                    price={answer.price.eur}
                    size={maxEurLength}
                  />
                </div>
              )}
              {showPriceTix && (
                <div className="CardsQuiz_Answer_Text">
                  <CardPriceIndicator
                    currency=""
                    price={answer.price.tix}
                    size={maxTixLength}
                  />
                </div>
              )}
              {showCost && (
                <div className="CardsQuiz_Answer_Text">
                  <CardCostIndicator cost={answer.cost} size={maxCostLength} />
                </div>
              )}
              {showColors && (
                <div className="CardsQuiz_Answer_Box">
                  <CardColorsIndicator
                    colors={answer.colors}
                    size={maxColorsLength}
                  />
                </div>
              )}
              {showIdentity && (
                <div className="CardsQuiz_Answer_Box">
                  <CardColorsIndicator
                    colors={answer.identity}
                    size={maxIdentityLength}
                  />
                </div>
              )}
              {showTypes && (
                <div className="CardsQuiz_Answer_Text">
                  <CardTypesIndicator
                    types={answer.types}
                    size={maxTypesLength}
                  />
                </div>
              )}
              {showStats && (
                <div className="CardsQuiz_Answer_Text">
                  <CardStatsIndicator
                    power={answer.stats.power}
                    toughness={answer.stats.toughness}
                    size={maxStatsLength}
                  />
                </div>
              )}

              {guessed.has(answer.id) ? (
                <span className="CardsQuiz_Answer_Name success">
                  <a
                    {...updateCardPreview(answer.image)}
                    href={answer.url}
                    target="_blank"
                  >
                    {answer.name}
                  </a>
                </span>
              ) : timer.status === TimerStatus.Stopped ? (
                <span className="CardsQuiz_Answer_Name failure">
                  <a
                    {...updateCardPreview(answer.image)}
                    className="error"
                    href={answer.url}
                    target="_blank"
                  >
                    {answer.name}
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
