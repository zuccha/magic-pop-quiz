import { msToTime } from "../models/time";
import "./quiz-progress.css";

export type QuizProgressProps = {
  guessed: number;
  total: number;
  time: number;
  dangerThreshold?: number;
};

export default function QuizProgress({
  guessed,
  total,
  time,
  dangerThreshold = 0,
}: QuizProgressProps) {
  return (
    <div className="QuizProgress">
      <span>{`${guessed}/${total}`}</span>
      <span>{`${Math.floor((100 * guessed) / total)}%`}</span>
      {Math.floor(time / 1000) <= Math.floor(dangerThreshold / 1000) ? (
        <span className="danger">{msToTime(time)}</span>
      ) : (
        <span>{msToTime(time)}</span>
      )}
    </div>
  );
}
