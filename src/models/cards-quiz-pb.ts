import { z } from "zod";

export const CardsQuizPBSchema = z.union([
  z.undefined(),
  z.object({
    date: z.coerce.date(),
    timeRemaining: z.number(),
    answersGuessed: z.number(),
    answersTotal: z.number(),
  }),
]);

export type CardsQuizPB = z.infer<typeof CardsQuizPBSchema>;
