import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTimer, { TimerStatus } from "../hooks/use-timer";
import { QuizRecord } from "../models/quiz-record";
import { CatalogQuizAnswer } from "../models/catalog-quiz-answer";
import {
  CatalogQuizType,
  formattedCatalogQuizType,
} from "../models/catalog-quiz-type";
import { sanitize } from "../utils";
import CatalogTypeIndicator from "./catalog-type-indicator";
import QuizProgress from "./quiz-progress";
import "./catalog-quiz.css";

export type CatalogQuizProps = {
  answers: CatalogQuizAnswer[];
  duration: number;
  onDone: (pb: QuizRecord) => void;
  types: CatalogQuizType[];
};

export default function CatalogQuiz({
  answers,
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
        ...answers.map(
          (answer) => formattedCatalogQuizType[answer.type].length,
        ),
      ),
    [answers],
  );

  const checkGuess = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const guess = sanitize(e.currentTarget.value);
      setGuessed((prevGuessed) => {
        const newGuessedAnswers = answers.filter(
          (answer) =>
            !prevGuessed.has(answer.name) && answer.simpleName === guess,
        );
        if (newGuessedAnswers.length === 0) return prevGuessed;
        if (inputRef.current) inputRef.current.value = "";
        const newGuessed = new Set(prevGuessed);
        newGuessedAnswers.forEach((answer) => newGuessed.add(answer.name));
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
        answersTotal: answers.length,
        timeRemaining: timer.remaining,
        date: new Date(),
      });
    }
  }, [answers.length, guessed.size, timer.remaining, timer.status, timer.stop]);

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
          total={answers.length}
        />
      </div>

      {timer.status === TimerStatus.Paused ? (
        <i>Quiz paused</i>
      ) : (
        <div className="CatalogQuiz_Answers">
          {answers.map((answer) => (
            <div key={answer.name}>
              {types.length > 1 && (
                <div className="CatalogQuiz_Answer_Text">
                  <CatalogTypeIndicator
                    type={answer.type}
                    size={maxTypeLength}
                  />
                </div>
              )}

              {guessed.has(answer.name) ? (
                <span className="CatalogQuiz_Answer_Name success">
                  {answer.name}
                </span>
              ) : timer.status === TimerStatus.Stopped ? (
                <span className="CatalogQuiz_Answer_Name failure">
                  {answer.name}
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
