import { CardsQuiz } from "../models/cards-quiz";
import { formatCardsQuizHints } from "../models/cards-quiz-hints";
import { msToTime } from "../models/time";
import "./cards-quiz-list.css";

export type QuizPresetsProps = {
  onSelectQuizPreset: (quiz: CardsQuiz) => void;
  presets: CardsQuiz[];
};

export default function QuizList({
  onSelectQuizPreset,
  presets,
}: QuizPresetsProps) {
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
        {presets.map((quiz) => (
          <tr onClick={() => onSelectQuizPreset(quiz)} key={quiz.name}>
            <td>
              <b>{quiz.name}</b>
            </td>
            <td>{quiz.query}</td>
            <td className="narrow">{msToTime(quiz.time)}</td>
            <td className="narrow">{formatCardsQuizHints(quiz.hints)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
