import quizPresets from "../data/quiz-presets";
import { CardsQuiz } from "../models/cards-quiz";
import { msToTime } from "../models/time";
import "./quiz-presets.css";

export type QuizPresetsProps = {
  onSelectQuizPreset: (quiz: CardsQuiz) => void;
};

export default function QuizPresets({ onSelectQuizPreset }: QuizPresetsProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {quizPresets.map((quiz) => (
          <tr onClick={() => onSelectQuizPreset(quiz)} key={quiz.name}>
            <td>{quiz.name}</td>
            <td>{msToTime(quiz.time)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
