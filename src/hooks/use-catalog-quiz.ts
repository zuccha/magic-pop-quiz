import { useMemo } from "react";
import { CatalogQuiz, loadCatalogQuizFromParams } from "../models/catalog-quiz";
import { QuizRecord } from "../models/quiz-record";
import useQuizPB from "./use-quiz-pb";

export function useCatalogQuizFromParams(): CatalogQuiz {
  return useMemo(() => loadCatalogQuizFromParams(), []);
}

export function useCatalogQuizPB(
  quiz: CatalogQuiz,
): [QuizRecord, (pb: QuizRecord) => void] {
  return useQuizPB(quiz.id, quiz.name);
}
