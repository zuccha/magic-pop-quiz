import { z } from "zod";

export const QuizRecordSchema = z.union([
  z.undefined(),
  z.object({
    date: z.coerce.date(),
    timeRemaining: z.number(),
    answersGuessed: z.number(),
    answersTotal: z.number(),
  }),
]);

export type QuizRecord = z.infer<typeof QuizRecordSchema>;
