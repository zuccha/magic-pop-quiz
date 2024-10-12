import { useCallback, useMemo } from "react";
import {
  CardsQuiz,
  cardsQuizFromId,
  loadCardsQuizFromParams,
} from "../models/cards-quiz";
import { CardsQuizPB, CardsQuizPBSchema } from "../models/cards-quiz-pb";
import Storage from "../store/storage";
import useStore, {
  parseBoolean,
  parseString,
  useStoreBoolean,
  useStoreString,
} from "./use-store";

const pbPrefix = "pb/";
const favPrefix = "fav/";
const namePrefix = "name/";

const pbId = (id: string) => `${pbPrefix}${id}`;
const favId = (id: string) => `${favPrefix}${id}`;
const nameId = (id: string) => `${namePrefix}${id}`;

export function useCardsQuizFromParams(defaultQuiz?: CardsQuiz): CardsQuiz {
  return useMemo(() => {
    return document.location.search.length > 0 || !defaultQuiz
      ? loadCardsQuizFromParams()
      : defaultQuiz;
  }, [defaultQuiz]);
}

export function useFavoriteCardsQuizzes(): CardsQuiz[] {
  return useMemo(
    () =>
      Storage.getIdsStartingWith(favPrefix)
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
      Storage.getIdsStartingWith(pbPrefix)
        .map((id) => {
          id = id.substring(pbPrefix.length);
          const pb = Storage.load(pbId(id), undefined, CardsQuizPBSchema.parse);
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
): [CardsQuizPB, (pb: CardsQuizPB) => void] {
  const [, setName] = useStoreString(`${namePrefix}${quiz.id}`, quiz.name);
  const [pb, setPB] = useStore(
    pbId(quiz.id),
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
  const [, setName] = useStoreString(nameId(quiz.id), quiz.name);
  const [isFavorite, setIsFavorite] = useStoreBoolean(favId(quiz.id), false);

  const toggleIsFavorite = useCallback(() => {
    setName(quiz.name);
    setIsFavorite((prev) => !prev);
  }, [quiz.name, setIsFavorite]);

  return [isFavorite, toggleIsFavorite];
}
