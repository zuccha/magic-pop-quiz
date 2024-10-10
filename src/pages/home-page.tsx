import { useRef, useCallback, useState } from "react";
import QuizCreationForm, {
  QuizCreationFormRefObject,
} from "../components/quiz-creation-form";
import QuizPresets from "../components/quiz-presets";
import cardsQuizCommanderPresets from "../data/cards-quiz-commander-presets";
import cardsQuizGenericPresets from "../data/cards-quiz-generic-presets";
import cardsQuizLegacyPresets from "../data/cards-quiz-legacy-presets";
import cardsQuizModernPresets from "../data/cards-quiz-modern-presets";
import cardsQuizPioneerPresets from "../data/cards-quiz-pioneer-presets";
import cardsQuizStandardPresets from "../data/cards-quiz-standard-presets";
import cardsQuizVintagePresets from "../data/cards-quiz-vintage-presets";
import useCardsQuizFromParams from "../hooks/use-cards-quiz-from-params";
import { CardsQuiz } from "../models/cards-quiz";
import "./home-page.css";

const presets = [
  { name: "Commander", presets: cardsQuizCommanderPresets },
  { name: "Vintage", presets: cardsQuizVintagePresets },
  { name: "Legacy", presets: cardsQuizLegacyPresets },
  { name: "Modern", presets: cardsQuizModernPresets },
  { name: "Pioneer", presets: cardsQuizPioneerPresets },
  { name: "Standard", presets: cardsQuizStandardPresets },
  { name: "Generic", presets: cardsQuizGenericPresets },
] as const;

type Preset = (typeof presets)[number];

export default function HomePage() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(presets[0]);
  const quizCreationFormRef = useRef<QuizCreationFormRefObject>(null);
  const quiz = useCardsQuizFromParams();

  const selectQuizPreset = useCallback(
    (quiz: CardsQuiz) => quizCreationFormRef.current?.configureQuiz(quiz),
    [],
  );

  return (
    <div className="HomePage">
      <div>
        <h2 className="HomePage_Title">Create a quiz</h2>
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
          defaultShowUsd={quiz.hints.showUsd}
          defaultShowEur={quiz.hints.showEur}
          defaultShowTix={quiz.hints.showTix}
          ref={quizCreationFormRef}
        />
      </div>

      <div>
        <h2>{"Presets: "}</h2>
        <div className="HomePage_Presets">
          {presets.map((preset) => (
            <span
              className={
                selectedPreset.name === preset.name ? "selected" : undefined
              }
              key={preset.name}
              onClick={() => setSelectedPreset(preset)}
            >
              {preset.name}
            </span>
          ))}
        </div>
        <QuizPresets
          onSelectQuizPreset={selectQuizPreset}
          presets={selectedPreset.presets}
        />
      </div>
    </div>
  );
}
