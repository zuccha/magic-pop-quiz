import { useRef, useCallback, useMemo } from "react";
import { z } from "zod";
import QuizCreationForm, {
  QuizCreationFormRefObject,
} from "../components/quiz-creation-form";
import CardsQuizList from "../components/cards-quiz-list";
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
import "./cards-page.css";

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

export default function CardsPage() {
  document.title = "Cards Quizzes • Magic Pop Quiz";

  const [selectedCategoryName, setSelectedCategoryName] =
    useStore<CategoryName>(
      "cards-quiz-category-name",
      "Generic",
      CategoryNameScheme.parse,
    );

  const quizCreationFormRef = useRef<QuizCreationFormRefObject>(null);

  const quiz = useCardsQuizFromParams();

  const configureQuiz = useCallback(
    (quiz: CardsQuiz) => quizCreationFormRef.current?.configureQuiz(quiz),
    [],
  );

  const openQuiz = useCallback((quiz: CardsQuiz) => {
    quizCreationFormRef.current?.configureQuiz(quiz);
    quizCreationFormRef.current?.createQuiz();
  }, []);

  const favoriteQuizzes = useFavoriteCardsQuizzes();
  const recentQuizzes = useRecentCardsQuizzes(10);

  const quizzes = {
    ...presets,
    Favorites: favoriteQuizzes,
    Recent: recentQuizzes,
  }[selectedCategoryName];

  const Tab = useCallback(
    ({ name }: { name: CategoryName }) => {
      return (
        <span
          className={selectedCategoryName === name ? "selected" : undefined}
          onClick={() => setSelectedCategoryName(name)}
        >
          {name}
        </span>
      );
    },
    [selectedCategoryName, setSelectedCategoryName],
  );

  const actions = useMemo(
    () => [{ icon: "pen", name: "Edit", onClick: configureQuiz }],
    [configureQuiz],
  );

  return (
    <div className="CardsPage">
      <div>
        <h2>New Cards Quiz</h2>
        <QuizCreationForm
          defaultName={quiz.name}
          defaultQuery={quiz.query}
          defaultOrder={quiz.order}
          defaultDirection={quiz.direction}
          defaultQuantity={quiz.quantity}
          defaultTime={quiz.time}
          defaultMode={quiz.mode}
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
        <h2>Cards Quizzes</h2>
        <div className="CardsPage_Presets">
          {favoriteQuizzes.length > 0 && (
            <>
              <Tab name="Favorites" />|
            </>
          )}

          {recentQuizzes.length > 0 && (
            <>
              <Tab name="Recent" />|
            </>
          )}

          {presetNames.map((name) => (
            <Tab key={name} name={name} />
          ))}
        </div>

        <CardsQuizList
          actions={actions}
          onSelectQuiz={openQuiz}
          quizzes={quizzes}
        />
      </div>
    </div>
  );
}
