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

export function loadCatalogQuizFromParams(
  params: URLSearchParams,
): CatalogQuiz {
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

export function saveCatalogQuizToParams(quiz: CatalogQuiz): URLSearchParams {
  const params = new URLSearchParams(document.location.origin);
  params.set("name", quiz.name);
  params.set("type", quiz.types.join(","));
  params.set("time", msToTime(quiz.time));
  return params;
}

export function catalogQuizFromValues(
  quiz: Omit<CatalogQuiz, "id">,
): CatalogQuiz {
  const types = quiz.types.map((t) => catalogQuizTypeEncodings[t]).join("");
  const time = msToTime(quiz.time).replace(":", "");
  const id = `k0${time}${types}`;
  return { ...quiz, id };
}

export function catalogQuizFromId(id: string, name: string): CatalogQuiz {
  return {
    id,
    name,
    time: timeToMs(`${id.slice(2, 4)}:${id.slice(4, 6)}`),
    types: id
      .slice(6)
      .split("")
      .map((t) => catalogQuizTypeDecodings[t as QuizTypeEncoding])
      .filter((type) => type !== undefined),
  };
}
