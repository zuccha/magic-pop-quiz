import { useRef, useCallback } from "react";
import QuizCreationForm, {
  QuizCreationFormRefObject,
} from "../components/quiz-creation-form";
import QuizPresets from "../components/quiz-presets";
import { Quiz } from "../models/quiz";
import "./home-page.css";

export default function HomePage() {
  const quizCreationFormRef = useRef<QuizCreationFormRefObject>(null);

  const createQuiz = useCallback((quiz: Quiz) => console.log(quiz), []);

  const selectQuizPreset = useCallback(
    (quiz: Quiz) => quizCreationFormRef.current?.configureQuiz(quiz),
    [],
  );

  return (
    <div className="HomePage">
      <div>
        <h4>Create a quiz:</h4>
        <QuizCreationForm onCreateQuiz={createQuiz} ref={quizCreationFormRef} />
      </div>

      <div>
        <h4>Presets:</h4>
        <QuizPresets onSelectQuizPreset={selectQuizPreset} />
      </div>
    </div>
  );
}
