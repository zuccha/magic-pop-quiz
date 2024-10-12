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
          <th>Time</th>
          <th>Hints</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map((quiz) => (
          <QuizEntry key={quiz.name} onSelectQuiz={onSelectQuiz} quiz={quiz} />
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
      <td className="narrow">
        {pb
          ? quiz.quantity === 0
            ? pb.answersGuessed
            : `${Math.floor((100 * pb.answersGuessed) / quiz.quantity)}%`
          : "-"}
      </td>
    </tr>
  );
}
