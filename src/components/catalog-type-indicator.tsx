import {
  CatalogQuizType,
  formattedCatalogQuizType,
} from "../models/catalog-quiz-type";
import { padR } from "../utils";
import "./catalog-type-indicator.css";

export type CatalogTypeIndicatorProps = {
  type: CatalogQuizType;
  size?: number;
};

export default function CatalogTypeIndicator({
  type,
  size,
}: CatalogTypeIndicatorProps) {
  return (
    <div className="CatalogTypeIndicator">
      {size
        ? padR(formattedCatalogQuizType[type], size)
        : formattedCatalogQuizType[type]}
    </div>
  );
}
