import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTimer, { TimerStatus } from "../hooks/use-timer";
import { QuizRecord } from "../models/quiz-record";
import { CatalogEntry } from "../models/catalog-entry";
import {
  CatalogQuizType,
  formattedCatalogQuizType,
} from "../models/catalog-quiz-type";
import { sanitize } from "../utils";
import CatalogTypeIndicator from "./catalog-type-indicator";
import QuizProgress from "./quiz-progress";
import "./catalog-quiz.css";

export type CatalogQuizProps = {
  entries: CatalogEntry[];
  duration: number;
  onDone: (pb: QuizRecord) => void;
  types: CatalogQuizType[];
};

export default function CatalogQuiz({
  entries,
  duration,
  onDone,
  types,
}: CatalogQuizProps) {
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const timer = useTimer(duration);

  const reset = useCallback(() => {
    timer.reset();
    setGuessed(new Set());
  }, [timer.reset]);

  const maxTypeLength = useMemo(
    () =>
      Math.max(
        ...entries.map((entry) => formattedCatalogQuizType[entry.type].length),
      ),
    [entries],
  );

  const checkGuess = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const guess = sanitize(e.currentTarget.value);
      setGuessed((prevGuessed) => {
        const newGuessedAnswers = entries.filter(
          (entry) => !prevGuessed.has(entry.name) && entry.simpleName === guess,
        );
        if (newGuessedAnswers.length === 0) return prevGuessed;
        if (inputRef.current) inputRef.current.value = "";
        const newGuessed = new Set(prevGuessed);
        newGuessedAnswers.forEach((entry) => newGuessed.add(entry.name));
        if (newGuessed.size === entries.length) timer.stop();
        return newGuessed;
      });
    },
    [entries, timer.stop],
  );

  useEffect(() => {
    if (timer.status === TimerStatus.Stopped) {
      onDone({
        answersGuessed: guessed.size,
        answersTotal: entries.length,
        timeRemaining: timer.remaining,
        date: new Date(),
      });
    }
  }, [entries.length, guessed.size, timer.remaining, timer.status, timer.stop]);

  return (
    <div className="CatalogQuiz">
      <div className="CatalogQuiz_Info">
        {timer.status === TimerStatus.Ready && (
          <div className="CatalogQuiz_Info_Ready">
            <button className="solid" onClick={timer.start}>
              Start
            </button>
          </div>
        )}

        {timer.status === TimerStatus.Running && (
          <div className="CatalogQuiz_Info_Running">
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
          <div className="CatalogQuiz_Info_Paused">
            <button onClick={timer.resume}>Resume</button>
            <button onClick={timer.stop} className="danger">
              Give Up
            </button>
          </div>
        )}

        {timer.status === TimerStatus.Stopped && (
          <div className="CatalogQuiz_Info_Stopped">
            <button className="solid" onClick={reset}>
              Reset
            </button>
          </div>
        )}

        <QuizProgress
          dangerThreshold={15 * 1000}
          guessed={guessed.size}
          time={timer.remaining}
          total={entries.length}
        />
      </div>

      {timer.status === TimerStatus.Paused ? (
        <i>Quiz paused</i>
      ) : (
        <div
          className={
            types.length === 1
              ? "CatalogQuiz_Answers compact"
              : "CatalogQuiz_Answers"
          }
        >
          {entries.map((entry) => (
            <div key={entry.name}>
              {types.length > 1 && (
                <div className="CatalogQuiz_Answer_Text">
                  <CatalogTypeIndicator
                    type={entry.type}
                    size={maxTypeLength}
                  />
                </div>
              )}

              {guessed.has(entry.name) ? (
                <span className="CatalogQuiz_Answer_Name success">
                  {entry.name}
                </span>
              ) : timer.status === TimerStatus.Stopped ? (
                <span className="CatalogQuiz_Answer_Name failure">
                  {entry.name}
                </span>
              ) : (
                <span className="CatalogQuiz_Answer_Name">&nbsp;</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
