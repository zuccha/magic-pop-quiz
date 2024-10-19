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
import { classNames, mod, validateListWithAtLeastOneItem } from "../utils";
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
  const timer = useTimer(quiz.time);

  const [guessed, setGuessed] = useState<Set<string>>(new Set());

  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const selectedCard = cards[selectedCardIndex] ?? blankCard;

  const revealCard =
    guessed.has(selectedCard.id) || timer.status === TimerStatus.Stopped;

  const inputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    timer.reset();
    setGuessed(new Set());
  }, [timer.reset]);

  const select = useCallback((index: number) => {
    inputRef.current?.focus();
    setSelectedCardIndex(index);
  }, []);

  const selectPrev = useCallback(() => {
    if (timer.status === TimerStatus.Stopped)
      return setSelectedCardIndex((prevIndex) =>
        mod(prevIndex - 1, cards.length),
      );

    inputRef.current?.focus();
    if (inputRef.current) inputRef.current.value = "";

    for (let i = selectedCardIndex - 1; i > 0; --i)
      if (!guessed.has(cards[i].id)) return setSelectedCardIndex(i);

    for (let i = cards.length - 1; i > selectedCardIndex; --i)
      if (!guessed.has(cards[i].id)) return setSelectedCardIndex(i);
  }, [cards, guessed, selectedCardIndex, timer.status]);

  const selectNext = useCallback(() => {
    if (timer.status === TimerStatus.Stopped)
      return setSelectedCardIndex((prevIndex) =>
        mod(prevIndex + 1, cards.length),
      );

    inputRef.current?.focus();
    if (inputRef.current) inputRef.current.value = "";

    for (let i = selectedCardIndex + 1; i < cards.length; ++i)
      if (!guessed.has(cards[i].id)) return setSelectedCardIndex(i);

    for (let i = 0; i < selectedCardIndex; ++i)
      if (!guessed.has(cards[i].id)) return setSelectedCardIndex(i);
  }, [cards, guessed, selectedCardIndex, timer.status]);

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

  const maskedCard = useMemo(() => {
    if (
      timer.status === TimerStatus.Ready ||
      timer.status === TimerStatus.Paused
    )
      return { ...blankCard, id: selectedCard.id };

    if (timer.status === TimerStatus.Stopped) return selectedCard;

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
  }, [guessed, quiz, selectedCard, timer.status]);

  useEffect(() => {
    if (!sliderRef.current) return;
    const em = parseFloat(window.getComputedStyle(sliderRef.current).fontSize);
    const left = 3.5 * em * selectedCardIndex;
    sliderRef.current?.scrollTo({ left, behavior: "smooth" });
  }, [selectedCardIndex]);

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

      <div className="CardsQuizSlideshow_Card">
        <CardSheet card={maskedCard} showReminder={quiz.hints.showReminder} />

        {timer.status === TimerStatus.Ready ||
        timer.status === TimerStatus.Paused ? (
          <div className="CardsQuizSlideshow_Prices" />
        ) : revealCard ? (
          <div className="CardsQuizSlideshow_Prices">
            <CardTextIndicator text={`$${maskedCard.price.usd}`} />
            <CardTextIndicator text={`€${maskedCard.price.eur}`} />
            <CardTextIndicator text={`T${maskedCard.price.tix}`} />
          </div>
        ) : (
          <div className="CardsQuizSlideshow_Prices">
            {quiz.hints.showPriceUsd && (
              <CardTextIndicator text={`$${maskedCard.price.usd}`} />
            )}
            {quiz.hints.showPriceEur && (
              <CardTextIndicator text={`€${maskedCard.price.eur}`} />
            )}
            {quiz.hints.showPriceTix && (
              <CardTextIndicator text={`T${maskedCard.price.tix}`} />
            )}
          </div>
        )}

        <div className="CardsQuizSlideshow_Slider">
          <button className="solid" onClick={selectPrev}>
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div className="CardsQuizSlideshow_Slider_Items" ref={sliderRef}>
            <div>
              {cards.map((card, i) => {
                const className = classNames([
                  ["CardsQuizSlideshow_Slider_Item", true],
                  ["solid", selectedCardIndex === i],
                  ["guessed", guessed.has(card.id)],
                  [
                    "missed",
                    timer.status === TimerStatus.Stopped &&
                      !guessed.has(card.id),
                  ],
                ]);

                return (
                  <button
                    className={className}
                    key={card.id}
                    onClick={() => select(i)}
                  >
                    {i + 1}
                    {selectedCardIndex === i && <div className="arrow" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="solid" onClick={selectNext}>
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
