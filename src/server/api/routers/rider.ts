import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const riderRouter = createTRPCRouter({
  getRider: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const rider = await ctx.db.rider.findUnique({
        where: {
          id: input.id,
        },
      });

      return rider;
    }),

  createRider: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const rider = await ctx.db.rider.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });

      return rider;
    }),
});
