import quizPresets from "../data/quiz-presets";
import { CardsQuiz } from "../models/cards-quiz";
import { formatHints } from "../models/hints";
import { msToTime } from "../models/time";
import "./quiz-presets.css";

export type QuizPresetsProps = {
  onSelectQuizPreset: (quiz: CardsQuiz) => void;
};

export default function QuizPresets({ onSelectQuizPreset }: QuizPresetsProps) {
  return (
    <table className="QuizPresets">
      <thead>
        <tr>
          <th>Name</th>
          <th>Query</th>
          <th>Time</th>
          <th>Hints</th>
        </tr>
      </thead>
      <tbody>
        {quizPresets.map((quiz) => (
          <tr onClick={() => onSelectQuizPreset(quiz)} key={quiz.name}>
            <td>
              <b>{quiz.name}</b>
            </td>
            <td>{quiz.query}</td>
            <td className="narrow">{msToTime(quiz.time)}</td>
            <td className="narrow">{formatHints(quiz.hints)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
