import { useCallback } from "react";
import { QuizRecord, QuizRecordSchema } from "../models/quiz-record";
import useStore, { useStoreString } from "./use-store";

export function createUseQuizLast(lastPrefix: string, namePrefix: string) {
  return function useQuizPB(
    id: string,
    name: string,
  ): [QuizRecord, (record: QuizRecord) => void] {
    const [, setName] = useStoreString(`${namePrefix}${id}`, name);
    const [last, setLast] = useStore(
      `${lastPrefix}${id}`,
      undefined,
      QuizRecordSchema.parse,
    );

    const updateLast = useCallback(
      (maybeLast: QuizRecord) => {
        setName(name);
        setLast((prevLast) =>
          maybeLast && (!prevLast || prevLast.date < maybeLast.date)
            ? maybeLast
            : prevLast,
        );
      },
      [name, setLast],
    );

    return [last, updateLast];
  };
}
