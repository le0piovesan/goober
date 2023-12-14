import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";

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
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingRider = await ctx.db.rider.findUnique({
        where: { email: input.email },
      });
      const existingDriver = await ctx.db.driver.findUnique({
        where: { email: input.email },
      });

      if (existingRider ?? existingDriver) {
        throw new Error("A user with this email already exists");
      }

      const rider = await ctx.db.rider.create({
        data: {
          name: input.name,
          email: input.email,
          password: bcrypt.hashSync(input.password, 10),
          image: input.image,
        },
      });

      return rider;
    }),
});
