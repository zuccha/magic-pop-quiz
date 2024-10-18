import { useCallback } from "react";
import { QuizRecord, QuizRecordSchema } from "../models/quiz-record";
import useStore, { useStoreString } from "./use-store";

export function createUseQuizPB(pbPrefix: string, namePrefix: string) {
  return function useQuizPB(
    id: string,
    name: string,
  ): [QuizRecord, (record: QuizRecord) => void] {
    const [, setName] = useStoreString(`${namePrefix}${id}`, name);
    const [pb, setPB] = useStore(
      `${pbPrefix}${id}`,
      undefined,
      QuizRecordSchema.parse,
    );

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
  };
}
