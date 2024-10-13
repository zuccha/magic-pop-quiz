import { useCallback } from "react";
import CatalogQuizList from "../components/catalog-quiz-list";
import catalogQuizPresets from "../data/catalog-quiz-presets";
import { CatalogQuiz } from "../models/catalog-quiz";
import "./catalog-page.css";

export default function CatalogPage() {
  const openQuiz = useCallback((_quiz: CatalogQuiz) => {
    // TODO.
  }, []);

  return (
    <div className="CatalogPage">
      <div>
        <h2>Catalog Quizzes</h2>

        <CatalogQuizList onSelectQuiz={openQuiz} quizzes={catalogQuizPresets} />
      </div>
    </div>
  );
}
