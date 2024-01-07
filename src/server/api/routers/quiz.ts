import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Quiz } from "@prisma/client";
import { z } from "zod";

export const quizRouter = createTRPCRouter({
  getQuiz: publicProcedure.query(async ({ ctx }) => {
    const quiz: Quiz[] = await ctx.db.quiz.findMany();
    return quiz;
  }),

  completeQuiz: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.driver.update({
        where: {
          id: input.id,
        },
        data: {
          tutorialCompleted: true,
        },
      });
    }),
});
