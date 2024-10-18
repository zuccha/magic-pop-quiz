import { useCallback, useMemo } from "react";
import {
  CardsQuiz,
  cardsQuizFromId,
  loadCardsQuizFromParams,
} from "../models/cards-quiz";
import { QuizRecord, QuizRecordSchema } from "../models/quiz-record";
import Storage from "../store/storage";
import { parseBoolean, parseString } from "./use-store";
import { createUseQuizPB } from "./use-quiz-pb";
import { createUseQuizFavorite } from "./use-quiz-favorite";
import { createUseQuizLast } from "./use-quiz-last";

const type = "cs/";
const pbPrefix = `${type}pb/`;
const lastPrefix = `${type}last/`;
const favPrefix = `${type}fav/`;
const namePrefix = `${type}name/`;

const nameId = (id: string) => `${namePrefix}${id}`;

const useQuizPB = createUseQuizPB(pbPrefix, namePrefix);
const useQuizLast = createUseQuizLast(lastPrefix, namePrefix);
const useQuizFavorite = createUseQuizFavorite(favPrefix, namePrefix);

export function useCardsQuizFromParams(): CardsQuiz {
  return useMemo(
    () =>
      loadCardsQuizFromParams(new URLSearchParams(document.location.search)),
    [],
  );
}

export function useFavoriteCardsQuizzes(): CardsQuiz[] {
  return useMemo(
    () =>
      Storage.getIdsStartingWith(favPrefix)
        .filter((id) => Storage.load(id, false, parseBoolean))
        .map((id) => {
          id = id.substring(favPrefix.length);
          const name = Storage.load(nameId(id), "Unnamed", parseString);
          return cardsQuizFromId(id, name);
        }),
    [],
  );
}

export function useRecentCardsQuizzes(amount?: number): CardsQuiz[] {
  return useMemo(
    () =>
      Storage.getIdsStartingWith(lastPrefix)
        .map((id) => {
          const pb = Storage.load(id, undefined, QuizRecordSchema.parse);
          id = id.substring(lastPrefix.length);
          return { id, pb };
        })
        .filter(({ pb }) => pb)
        .sort(({ pb: pb1 }, { pb: pb2 }) => {
          if (pb1!.date > pb2!.date) return -1;
          if (pb1!.date < pb2!.date) return 1;
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

export function useCardsQuizRecord(
  quiz: CardsQuiz,
): [{ last: QuizRecord; pb: QuizRecord }, (reocrd: QuizRecord) => void] {
  const [pb, setPB] = useQuizPB(quiz.id, quiz.name);
  const [last, setLast] = useQuizLast(quiz.id, quiz.name);

  const setRecord = useCallback(
    (record: QuizRecord) => {
      setLast(record);
      setPB(record);
    },
    [setLast, setPB],
  );

  return [{ last, pb }, setRecord];
}

export function useCardsQuizLast(
  quiz: CardsQuiz,
): [QuizRecord, (pb: QuizRecord) => void] {
  return useQuizLast(quiz.id, quiz.name);
}

export function useCardsQuizFavorite(quiz: CardsQuiz): [boolean, () => void] {
  return useQuizFavorite(quiz.id, quiz.name);
}
