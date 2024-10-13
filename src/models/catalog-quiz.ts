import { clamp } from "../utils";
import {
  CatalogQuizType,
  catalogQuizTypeDecodings,
  catalogQuizTypeEncodings,
  QuizTypeEncoding,
  validateCatalogQuizType,
} from "./catalog-quiz-type";
import { minutes, msToTime, seconds, timeToMs } from "./time";

export type CatalogQuiz = {
  id: string;
  name: string;
  types: CatalogQuizType[];
  time: number;
};

export function loadCatalogQuizFromParams(): CatalogQuiz {
  const params = new URLSearchParams(document.location.search);

  return catalogQuizFromValues({
    name: params.get("name") ?? "",
    types:
      params
        .get("type")
        ?.split(",")
        .map((t) => validateCatalogQuizType(t))
        .filter((type) => type !== undefined) ?? [],
    time: clamp(
      timeToMs(params.get("time") ?? "10:00"),
      1 * seconds,
      60 * minutes - 1 * seconds,
    ),
  });
}

export function saveCatalogQuizToParams(quiz: CatalogQuiz): void {
  const url = new URL(document.location.origin);
  url.searchParams.set("name", quiz.name);
  url.searchParams.set("type", quiz.types.join(","));
  url.searchParams.set("time", msToTime(quiz.time));
  document.location.href = url.href;
}

export function catalogQuizFromValues(
  quiz: Omit<CatalogQuiz, "id">,
): CatalogQuiz {
  const types = quiz.types.map((t) => catalogQuizTypeEncodings[t]).join("");
  const time = msToTime(quiz.time);
  const id = `ks00${time}${types}`;
  return { ...quiz, id };
}

export function catalogQuizFromId(id: string, name: string): CatalogQuiz {
  return {
    id,
    name,
    time: timeToMs(id.slice(4, 9)),
    types: id
      .slice(9)
      .split("")
      .map((t) => catalogQuizTypeDecodings[t as QuizTypeEncoding])
      .filter((type) => type !== undefined),
  };
}
