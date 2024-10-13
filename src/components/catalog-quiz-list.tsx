import { useCatalogQuizPB } from "../hooks/use-catalog-quiz";
import { CatalogQuiz } from "../models/catalog-quiz";
import { msToTime } from "../models/time";
import "./catalog-quiz-list.css";

export type CatalogQuizListProps = {
  onSelectQuiz: (quiz: CatalogQuiz) => void;
  quizzes: CatalogQuiz[];
};

export default function CatalogQuizList({
  onSelectQuiz,
  quizzes,
}: CatalogQuizListProps) {
  return (
    <table className="CatalogQuizList">
      <thead>
        <tr>
          <th>Name</th>
          <th className="narrow">Time</th>
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
  onSelectQuiz: (quiz: CatalogQuiz) => void;
  quiz: CatalogQuiz;
};

function QuizEntry({ onSelectQuiz, quiz }: QuizEntryProps) {
  const [pb] = useCatalogQuizPB(quiz);

  return (
    <tr onClick={() => onSelectQuiz(quiz)}>
      <td>
        <b>{quiz.name}</b>
      </td>
      <td className="narrow">{msToTime(quiz.time)}</td>
      <td className="narrow right">
        {pb
          ? `${Math.floor((100 * pb.answersGuessed) / pb.answersTotal)}%`
          : "-"}
      </td>
    </tr>
  );
}
