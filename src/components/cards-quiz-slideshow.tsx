import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTimer, { TimerStatus } from "../hooks/use-timer";
import {
  blankCard,
  blankCardFace,
  Card,
  guessMatchesCard,
} from "../models/card";
import { CardsQuiz } from "../models/cards-quiz";
import { QuizRecord } from "../models/quiz-record";
import { seconds } from "../models/time";
import { validateListWithAtLeastOneItem } from "../utils";
import CardSheet from "./card-sheet";
import QuizProgress from "./quiz-progress";
import "./cards-quiz-slideshow.css";
import CardTextIndicator from "./card-text-indicator";

export type CardsQuizFreeTypingProps = {
  cards: Card[];
  onDone: (pb: QuizRecord) => void;
  quiz: CardsQuiz;
};

export default function CardsQuizFreeTyping({
  cards,
  onDone,
  quiz,
}: CardsQuizFreeTypingProps) {
  const [guessed, setGuessed] = useState<Set<string>>(new Set());

  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const selectedCard = cards[selectedCardIndex] ?? blankCard;

  const inputRef = useRef<HTMLInputElement>(null);

  const timer = useTimer(quiz.time);

  const reset = useCallback(() => {
    timer.reset();
    setGuessed(new Set());
  }, [timer.reset]);

  const selectPrev = useCallback(() => {
    inputRef.current?.focus();
    if (inputRef.current) inputRef.current.value = "";

    for (let i = selectedCardIndex - 1; i > 0; --i)
      if (!guessed.has(cards[i].id)) return setSelectedCardIndex(i);

    for (let i = cards.length - 1; i > selectedCardIndex; --i)
      if (!guessed.has(cards[i].id)) return setSelectedCardIndex(i);
  }, [cards, guessed, selectedCardIndex]);

  const selectNext = useCallback(() => {
    inputRef.current?.focus();
    if (inputRef.current) inputRef.current.value = "";

    for (let i = selectedCardIndex + 1; i < cards.length; ++i)
      if (!guessed.has(cards[i].id)) return setSelectedCardIndex(i);

    for (let i = 0; i < selectedCardIndex; ++i)
      if (!guessed.has(cards[i].id)) return setSelectedCardIndex(i);
  }, [cards, guessed, selectedCardIndex]);

  const checkGuess = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const guess = e.currentTarget.value;
      setGuessed((prevGuessed) => {
        const nextGuessedCard =
          !prevGuessed.has(selectedCard.id) &&
          guessMatchesCard(selectedCard, guess);
        if (!nextGuessedCard) return prevGuessed;
        if (inputRef.current) inputRef.current.value = "";
        const nextGuessed = new Set(prevGuessed);
        nextGuessed.add(selectedCard.id);
        if (nextGuessed.size === cards.length) timer.stop();
        selectNext();
        return nextGuessed;
      });
    },
    [cards, selectNext, selectedCard, timer.stop],
  );

  const card = useMemo(() => {
    return guessed.has(selectedCard.id)
      ? selectedCard
      : {
          ...selectedCard,
          faces: validateListWithAtLeastOneItem(
            selectedCard.faces.map((face) => ({
              ...face,
              art: quiz.hints.showImage ? face.art : "",
              artist: quiz.hints.showArtist ? face.artist : "",
              colors: quiz.hints.showColors ? face.colors : [],
              cost: quiz.hints.showCost ? face.cost : [],
              flavor: quiz.hints.showFlavor ? face.flavor : undefined,
              name: "",
              oracle: quiz.hints.showOracle
                ? face.oracle.replace(new RegExp(face.name, "g"), "~")
                : "",
              stats: quiz.hints.showStats
                ? face.stats
                : face.stats
                  ? " "
                  : undefined,
              typeLine: quiz.hints.showTypes ? face.typeLine : "",
            })),
            blankCardFace,
          ),
          rarity: quiz.hints.showRarity ? selectedCard.rarity : "",
          releaseYear: quiz.hints.showYear ? selectedCard.releaseYear : "",
          set: quiz.hints.showSet ? selectedCard.set : { code: "", name: "" },
        };
  }, [guessed, quiz, selectedCard]);

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
    <div className="CardsQuizSlideshow">
      <div className="CardsQuizSlideshow_Info">
        {timer.status === TimerStatus.Ready && (
          <div className="CardsQuizSlideshow_Info_Ready">
            <button className="solid" onClick={timer.start}>
              Start
            </button>
          </div>
        )}

        {timer.status === TimerStatus.Running && (
          <div className="CardsQuizSlideshow_Info_Running">
            <button onClick={selectPrev}>Prev</button>
            <input
              autoFocus
              name="q"
              onChange={checkGuess}
              placeholder="Answer"
              ref={inputRef}
              spellCheck={false}
            />
            <button onClick={selectNext}>Next</button>

            <div className="CardsQuizSlideshow_Info_Divider" />

            <button onClick={timer.pause}>Pause</button>
            <button onClick={timer.stop} className="danger">
              Give Up
            </button>
          </div>
        )}

        {timer.status === TimerStatus.Paused && (
          <div className="CardsQuizSlideshow_Info_Paused">
            <button onClick={timer.resume}>Resume</button>
            <button onClick={timer.stop} className="danger">
              Give Up
            </button>
          </div>
        )}

        {timer.status === TimerStatus.Stopped && (
          <div className="CardsQuizSlideshow_Info_Stopped">
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
        <div className="CardsQuizSlideshow_Card">
          <CardSheet card={card} showReminder={quiz.hints.showReminder} />
          <div className="CardsQuizSlideshow_Prices">
            {quiz.hints.showPriceUsd && (
              <CardTextIndicator text={`$${card.price.usd}`} />
            )}
            {quiz.hints.showPriceEur && (
              <CardTextIndicator text={`€${card.price.eur}`} />
            )}
            {quiz.hints.showPriceTix && (
              <CardTextIndicator text={`${card.price.tix}`} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
