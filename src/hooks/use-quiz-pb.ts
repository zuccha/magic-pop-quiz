import { useCallback } from "react";
import { QuizRecord, QuizRecordSchema } from "../models/quiz-record";
import useStore, { useStoreString } from "./use-store";

const pbPrefix = "pb/";
const namePrefix = "name/";

const pbId = (id: string) => `${pbPrefix}${id}`;
const nameId = (id: string) => `${namePrefix}${id}`;

export default function useQuizPB(
  id: string,
  name: string,
): [QuizRecord, (record: QuizRecord) => void] {
  const [, setName] = useStoreString(nameId(id), name);
  const [pb, setPB] = useStore(pbId(id), undefined, QuizRecordSchema.parse);

  const updatePB = useCallback(
    (maybePB: QuizRecord) => {
      setName(name);
      setPB((prevPB) =>
        maybePB &&
        (!prevPB ||
          prevPB.answersGuessed < maybePB.answersGuessed ||
          (prevPB.answersGuessed === maybePB.answersGuessed &&
            prevPB.timeRemaining < maybePB.timeRemaining))
          ? maybePB
          : prevPB,
      );
    },
    [name, setPB],
  );

  return [pb, updatePB];
}
