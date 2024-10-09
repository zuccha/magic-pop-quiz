import { useRef, useCallback } from "react";
import QuizCreationForm, {
  QuizCreationFormRefObject,
} from "../components/quiz-creation-form";
import QuizPresets from "../components/quiz-presets";
import { CardsQuiz } from "../models/cards-quiz";
import "./home-page.css";

export default function HomePage() {
  const quizCreationFormRef = useRef<QuizCreationFormRefObject>(null);

  const createQuiz = useCallback((quiz: CardsQuiz) => console.log(quiz), []);

  const selectQuizPreset = useCallback(
    (quiz: CardsQuiz) => quizCreationFormRef.current?.configureQuiz(quiz),
    [],
  );

  return (
    <div className="HomePage">
      <div>
        <h2>Create a quiz</h2>
        <QuizCreationForm onCreateQuiz={createQuiz} ref={quizCreationFormRef} />
      </div>

      <div>
        <h2>Presets</h2>
        <QuizPresets onSelectQuizPreset={selectQuizPreset} />
      </div>
    </div>
  );
}
