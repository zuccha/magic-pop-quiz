import { useRef, useCallback } from "react";
import QuizCreationForm, {
  QuizCreationFormRefObject,
} from "../components/quiz-creation-form";
import QuizList from "../components/quiz-list";
import cardsQuizCommanderPresets from "../data/cards-quiz-commander-presets";
import cardsQuizGenericPresets from "../data/cards-quiz-generic-presets";
import cardsQuizLegacyPresets from "../data/cards-quiz-legacy-presets";
import cardsQuizModernPresets from "../data/cards-quiz-modern-presets";
import cardsQuizPioneerPresets from "../data/cards-quiz-pioneer-presets";
import cardsQuizStandardPresets from "../data/cards-quiz-standard-presets";
import cardsQuizVintagePresets from "../data/cards-quiz-vintage-presets";
import {
  useCardsQuizFromParams,
  useFavoriteCardsQuizzes,
  useRecentCardsQuizzes,
} from "../hooks/use-cards-quiz";
import useStore from "../hooks/use-store";
import { CardsQuiz } from "../models/cards-quiz";
import "./home-page.css";
import { z } from "zod";

const presetNames = [
  "Generic",
  "Commander",
  "Vintage",
  "Legacy",
  "Modern",
  "Pioneer",
  "Standard",
] as const;
const PresetNameScheme = z.enum(presetNames);
type PresetName = z.infer<typeof PresetNameScheme>;

const presets: Record<PresetName, CardsQuiz[]> = {
  Generic: cardsQuizGenericPresets,
  Commander: cardsQuizCommanderPresets,
  Vintage: cardsQuizVintagePresets,
  Legacy: cardsQuizLegacyPresets,
  Modern: cardsQuizModernPresets,
  Pioneer: cardsQuizPioneerPresets,
  Standard: cardsQuizStandardPresets,
} as const;

const categoryNames = ["Favorites", "Recent", ...presetNames] as const;
const CategoryNameScheme = z.enum(categoryNames);
type CategoryName = z.infer<typeof CategoryNameScheme>;

export default function HomePage() {
  const [selectedCategoryName, setSelectedCategoryName] =
    useStore<CategoryName>(
      "cards-quiz-category-name",
      "Generic",
      CategoryNameScheme.parse,
    );

  const quizCreationFormRef = useRef<QuizCreationFormRefObject>(null);

  const quiz = useCardsQuizFromParams(cardsQuizCommanderPresets[0]);

  const configureQuiz = useCallback(
    (quiz: CardsQuiz) => quizCreationFormRef.current?.configureQuiz(quiz),
    [],
  );

  const favoriteQuizzes = useFavoriteCardsQuizzes();
  const recentQuizzes = useRecentCardsQuizzes(10);

  const quizzes = {
    ...presets,
    Favorites: favoriteQuizzes,
    Recent: recentQuizzes,
  }[selectedCategoryName];

  return (
    <div className="HomePage">
      <div>
        <h2 className="HomePage_Title">Setup Quiz:</h2>
        <QuizCreationForm
          defaultName={quiz.name}
          defaultQuery={quiz.query}
          defaultOrder={quiz.order}
          defaultDirection={quiz.direction}
          defaultQuantity={quiz.quantity}
          defaultTime={quiz.time}
          defaultShowCost={quiz.hints.showCost}
          defaultShowColors={quiz.hints.showColors}
          defaultShowIdentity={quiz.hints.showIdentity}
          defaultShowTypes={quiz.hints.showTypes}
          defaultShowUsd={quiz.hints.showPriceUsd}
          defaultShowEur={quiz.hints.showPriceEur}
          defaultShowTix={quiz.hints.showPriceTix}
          ref={quizCreationFormRef}
        />
      </div>

      <div>
        <h2>{"Presets: "}</h2>
        <div className="HomePage_Presets">
          {favoriteQuizzes.length > 0 && (
            <>
              <span
                className={
                  selectedCategoryName === "Favorites" ? "selected" : undefined
                }
                onClick={() => setSelectedCategoryName("Favorites")}
              >
                Favorites
              </span>
              |
            </>
          )}

          {recentQuizzes.length > 0 && (
            <>
              <span
                className={
                  selectedCategoryName === "Recent" ? "selected" : undefined
                }
                onClick={() => setSelectedCategoryName("Recent")}
              >
                Recent
              </span>
              |
            </>
          )}

          {presetNames.map((name) => (
            <span
              className={selectedCategoryName === name ? "selected" : undefined}
              key={name}
              onClick={() => setSelectedCategoryName(name)}
            >
              {name}
            </span>
          ))}
        </div>
        <QuizList onSelectQuiz={configureQuiz} quizzes={quizzes} />
      </div>
    </div>
  );
}
