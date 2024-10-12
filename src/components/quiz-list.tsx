import { useCardsQuizPB } from "../hooks/use-cards-quiz";
import { CardsQuiz } from "../models/cards-quiz";
import { formatHints } from "../models/hints";
import { msToTime } from "../models/time";
import "./quiz-list.css";

export type QuizListAction = {
  icon: string;
  name: string;
  onClick: (quiz: CardsQuiz) => void;
};

export type QuizListProps = {
  actions?: QuizListAction[];
  onSelectQuiz: (quiz: CardsQuiz) => void;
  quizzes: CardsQuiz[];
};

export default function QuizList({
  actions = [],
  onSelectQuiz,
  quizzes,
}: QuizListProps) {
  return (
    <table className="QuizList">
      <thead>
        <tr>
          <th>Name</th>
          <th>Query</th>
          <th className="narrow">Time</th>
          <th className="narrow">Hints</th>
          <th className="narrow right">Score</th>
          {actions.length > 0 && <th className="narrow"></th>}
        </tr>
      </thead>
      <tbody>
        {quizzes.map((quiz) => (
          <QuizEntry
            actions={actions}
            key={quiz.id}
            onSelectQuiz={onSelectQuiz}
            quiz={quiz}
          />
        ))}
      </tbody>
    </table>
  );
}

type QuizEntryProps = {
  actions: QuizListAction[];
  onSelectQuiz: (quiz: CardsQuiz) => void;
  quiz: CardsQuiz;
};

function QuizEntry({ actions, onSelectQuiz, quiz }: QuizEntryProps) {
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
      {actions.length > 0 && (
        <td className="actions narrow">
          {actions.map((action) => (
            <button
              className="small icon"
              key={action.name}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(quiz);
              }}
            >
              <abbr
                className={`fa-solid fa-${action.icon}`}
                title={action.name}
              />
            </button>
          ))}
        </td>
      )}
    </tr>
  );
}
