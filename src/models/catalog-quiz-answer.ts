import { CatalogQuizType } from "./catalog-quiz-type";

export type CatalogQuizAnswer = {
  type: CatalogQuizType;
  name: string;
  simpleName: string;
};
