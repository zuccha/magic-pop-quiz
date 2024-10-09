import quizPresets from "../data/quiz-presets";
import { Quiz } from "../models/quiz";
import "./quiz-presets.css";

export type QuizPresetsProps = {
  onSelectQuizPreset: (quiz: Quiz) => void;
};

export default function QuizPresets({ onSelectQuizPreset }: QuizPresetsProps) {
  return (
    <table>
      <tbody>
        {quizPresets.map((quiz) => (
          <tr onClick={() => onSelectQuizPreset(quiz)} key={quiz.description}>
            <td>{quiz.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
