import { useRef, useCallback } from "react";
import QuizCreationForm, {
  QuizCreationFormRefObject,
} from "../components/quiz-creation-form";
import QuizPresets from "../components/quiz-presets";
import useCardsQuizFromParams from "../hooks/use-cards-quiz-from-params";
import { CardsQuiz } from "../models/cards-quiz";
import "./home-page.css";

export default function HomePage() {
  const quizCreationFormRef = useRef<QuizCreationFormRefObject>(null);
  const quiz = useCardsQuizFromParams();

  const selectQuizPreset = useCallback(
    (quiz: CardsQuiz) => quizCreationFormRef.current?.configureQuiz(quiz),
    [],
  );

  return (
    <div className="HomePage">
      <div>
        <h2>Create a quiz</h2>
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
        <h2>Presets</h2>
        <QuizPresets onSelectQuizPreset={selectQuizPreset} />
      </div>
    </div>
  );
}
