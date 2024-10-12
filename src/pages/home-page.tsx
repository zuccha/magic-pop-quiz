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
import useStore from "../hooks/use-store";
import { CardsQuiz, loadCardsQuizFromParams } from "../models/cards-quiz";
import "./home-page.css";
import { z } from "zod";

const presetNames = [
  "Favorites",
  "Recent",
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
  Favorites: [],
  Recent: [],
  Generic: cardsQuizGenericPresets,
  Commander: cardsQuizCommanderPresets,
  Vintage: cardsQuizVintagePresets,
  Legacy: cardsQuizLegacyPresets,
  Modern: cardsQuizModernPresets,
  Pioneer: cardsQuizPioneerPresets,
  Standard: cardsQuizStandardPresets,
} as const;

export default function HomePage() {
  const [selectedPresetName, setSelectedPresetName] = useStore<PresetName>(
    "preset-name",
    "Generic",
    PresetNameScheme.parse,
  );

  const quizCreationFormRef = useRef<QuizCreationFormRefObject>(null);

  const quiz =
    document.location.search.length > 0
      ? loadCardsQuizFromParams()
      : cardsQuizCommanderPresets[0];

  const configureQuiz = useCallback(
    (quiz: CardsQuiz) => quizCreationFormRef.current?.configureQuiz(quiz),
    [],
  );

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
          {presetNames.map((name) =>
            presets[name].length > 0 ? (
              <span
                className={selectedPresetName === name ? "selected" : undefined}
                key={name}
                onClick={() => setSelectedPresetName(name)}
              >
                {name}
              </span>
            ) : null,
          )}
        </div>
        <QuizList
          onSelectQuiz={configureQuiz}
          quizzes={presets[selectedPresetName]}
        />
      </div>
    </div>
  );
}
