import CatalogQuizList from "../components/catalog-quiz-list";
import catalogQuizPresets from "../data/catalog-quiz-presets";
import { CatalogQuiz, saveCatalogQuizToParams } from "../models/catalog-quiz";
import "./catalog-page.css";

const openQuiz = (quiz: CatalogQuiz) => {
  const url = new URL(document.location.origin);
  url.pathname = "/quiz/catalogue";
  url.search = saveCatalogQuizToParams(quiz).toString();
  document.location.href = url.href;
};

export default function CatalogPage() {
  return (
    <div className="CatalogPage">
      <div>
        <h2>Catalog Quizzes</h2>

        <CatalogQuizList onSelectQuiz={openQuiz} quizzes={catalogQuizPresets} />
      </div>
    </div>
  );
}
