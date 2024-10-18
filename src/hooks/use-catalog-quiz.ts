import { useMemo } from "react";
import { CatalogQuiz, loadCatalogQuizFromParams } from "../models/catalog-quiz";
import { QuizRecord } from "../models/quiz-record";
import { createUseQuizPB } from "./use-quiz-pb";

const type = "ks/";
const pbPrefix = `${type}pb/`;
const namePrefix = `${type}name/`;

const useQuizPB = createUseQuizPB(pbPrefix, namePrefix);

export function useCatalogQuizFromParams(): CatalogQuiz {
  return useMemo(
    () =>
      loadCatalogQuizFromParams(new URLSearchParams(document.location.search)),
    [],
  );
}

export function useCatalogQuizPB(
  quiz: CatalogQuiz,
): [QuizRecord, (pb: QuizRecord) => void] {
  return useQuizPB(quiz.id, quiz.name);
}
