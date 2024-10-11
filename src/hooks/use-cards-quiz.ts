import { useCallback } from "react";
import { CardsQuiz } from "../models/cards-quiz";
import useStore, { useStoreBoolean, useStoreString } from "./use-store";
import { CardsQuizPB, CardsQuizPBSchema } from "../models/cards-quiz-pb";

export function useCardsQuizPB(
  quiz: CardsQuiz,
): [CardsQuizPB, (pb: CardsQuizPB) => void] {
  const [, setName] = useStoreString(`name/${quiz.id}`, quiz.name);
  const [pb, setPB] = useStore(
    `pb/${quiz.id}`,
    undefined,
    CardsQuizPBSchema.parse,
  );

  const updatePB = useCallback(
    (maybePB: CardsQuizPB) => {
      setName(quiz.name);
      setPB((prevPB) =>
        maybePB &&
        (!prevPB ||
          prevPB.answersGuessed < maybePB.answersGuessed ||
          (prevPB.answersGuessed === maybePB.answersGuessed &&
            prevPB.timeRemaining < maybePB.timeRemaining))
          ? maybePB
          : prevPB,
      );
    },
    [quiz.name, setPB],
  );

  return [pb, updatePB];
}

export function useCardsQuizIsFavorite(quiz: CardsQuiz): [boolean, () => void] {
  const [, setName] = useStoreString(`name/${quiz.id}`, quiz.name);
  const [isFavorite, setIsFavorite] = useStoreBoolean(`fav/${quiz.id}`, false);

  const toggleIsFavorite = useCallback(() => {
    setName(quiz.name);
    setIsFavorite((prev) => !prev);
  }, [quiz.name, setIsFavorite]);

  return [isFavorite, toggleIsFavorite];
}
