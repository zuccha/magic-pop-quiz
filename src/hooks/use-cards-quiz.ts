import { useCallback } from "react";
import { CardsQuiz } from "../models/cards-quiz";
import { useStoreBoolean, useStoreString } from "./use-store";

export function useCardsQuizIsFavorite(quiz: CardsQuiz): [boolean, () => void] {
  const [, setName] = useStoreString(`name/${quiz.id}`, quiz.name);
  const [isFavorite, setIsFavorite] = useStoreBoolean(`fav/${quiz.id}`, false);

  const toggleIsFavorite = useCallback(() => {
    setName(quiz.name);
    setIsFavorite((prev) => !prev);
  }, [quiz.name]);

  return [isFavorite, toggleIsFavorite];
}
