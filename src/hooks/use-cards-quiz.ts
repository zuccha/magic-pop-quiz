import { useCallback, useMemo } from "react";
import {
  CardsQuiz,
  cardsQuizFromId,
  loadCardsQuizFromParams,
} from "../models/cards-quiz";
import { QuizRecord, QuizRecordSchema } from "../models/quiz-record";
import Storage from "../store/storage";
import {
  parseBoolean,
  parseString,
  useStoreBoolean,
  useStoreString,
} from "./use-store";
import useQuizPB from "./use-quiz-pb";

const pbPrefix = "pb/";
const favPrefix = "fav/";
const namePrefix = "name/";

const pbId = (id: string) => `${pbPrefix}${id}`;
const favId = (id: string) => `${favPrefix}${id}`;
const nameId = (id: string) => `${namePrefix}${id}`;

export function useCardsQuizFromParams(): CardsQuiz {
  return useMemo(() => loadCardsQuizFromParams(), []);
}

export function useFavoriteCardsQuizzes(): CardsQuiz[] {
  return useMemo(
    () =>
      Storage.getIdsStartingWith(`${favPrefix}cs`)
        .map((id) => id.substring(favPrefix.length))
        .filter((id) => Storage.load(favId(id), false, parseBoolean))
        .map((id) => {
          const name = Storage.load(nameId(id), "Unnamed", parseString);
          return cardsQuizFromId(id, name);
        }),
    [],
  );
}

export function useRecentCardsQuizzes(amount?: number): CardsQuiz[] {
  return useMemo(
    () =>
      Storage.getIdsStartingWith(`${pbPrefix}cs`)
        .map((id) => {
          id = id.substring(pbPrefix.length);
          const pb = Storage.load(pbId(id), undefined, QuizRecordSchema.parse);
          return { id, pb };
        })
        .filter(({ pb }) => pb)
        .sort(({ pb: pb1 }, { pb: pb2 }) => {
          if (pb1!.date > pb2!.date) return 1;
          if (pb1!.date < pb2!.date) return -1;
          return 0;
        })
        .slice(0, amount)
        .map(({ id }) => {
          const name = Storage.load(nameId(id), "Unnamed", parseString);
          return cardsQuizFromId(id, name);
        }),
    [],
  );
}

export function useCardsQuizPB(
  quiz: CardsQuiz,
): [QuizRecord, (pb: QuizRecord) => void] {
  return useQuizPB(quiz.id, quiz.name);
}

export function useCardsQuizIsFavorite(quiz: CardsQuiz): [boolean, () => void] {
  const [, setName] = useStoreString(nameId(quiz.id), quiz.name);
  const [isFavorite, setIsFavorite] = useStoreBoolean(favId(quiz.id), false);

  const toggleIsFavorite = useCallback(() => {
    setName(quiz.name);
    setIsFavorite((prev) => !prev);
  }, [quiz.name, setIsFavorite]);

  return [isFavorite, toggleIsFavorite];
}
