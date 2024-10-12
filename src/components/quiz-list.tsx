import { useCardsQuizPB } from "../hooks/use-cards-quiz";
import { CardsQuiz } from "../models/cards-quiz";
import { formatHints } from "../models/hints";
import { msToTime } from "../models/time";
import "./quiz-list.css";

export type QuizListProps = {
  onSelectQuiz: (quiz: CardsQuiz) => void;
  quizzes: CardsQuiz[];
};

export default function QuizList({ onSelectQuiz, quizzes }: QuizListProps) {
  return (
    <table className="QuizList">
      <thead>
        <tr>
          <th>Name</th>
          <th>Query</th>
          <th className="narrow">Time</th>
          <th className="narrow">Hints</th>
          <th className="narrow right">Score</th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map((quiz) => (
          <QuizEntry key={quiz.id} onSelectQuiz={onSelectQuiz} quiz={quiz} />
        ))}
      </tbody>
    </table>
  );
}

type QuizEntryProps = {
  onSelectQuiz: (quiz: CardsQuiz) => void;
  quiz: CardsQuiz;
};

function QuizEntry({ onSelectQuiz, quiz }: QuizEntryProps) {
  const [pb] = useCardsQuizPB(quiz);

  return (
    <tr onClick={() => onSelectQuiz(quiz)}>
      <td>
        <b>{quiz.name}</b>
      </td>
      <td>{quiz.query}</td>
      <td className="narrow">{msToTime(quiz.time)}</td>
      <td className="narrow">{formatHints(quiz.hints)}</td>
      <td className="narrow right">
        {pb
          ? `${Math.floor((100 * pb.answersGuessed) / pb.answersTotal)}%`
          : "-"}
      </td>
    </tr>
  );
}
