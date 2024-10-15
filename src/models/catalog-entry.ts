import { CatalogQuizType } from "./catalog-quiz-type";

export type CatalogEntry = {
  type: CatalogQuizType;
  name: string;
  simpleName: string;
};
