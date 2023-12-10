import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const driverRouter = createTRPCRouter({
  getDriver: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.findUnique({
        where: {
          id: input.id,
        },
      });

      return driver;
    }),

  createDriver: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingDriver = await ctx.db.driver.findUnique({
        where: { email: input.email },
      });

      const existingRider = await ctx.db.rider.findUnique({
        where: { email: input.email },
      });

      if (existingDriver ?? existingRider) {
        throw new Error("A user with this email already exists");
      }

      const driver = await ctx.db.driver.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });

      return driver;
    }),

  updateDriver: publicProcedure
    .input(
      z.object({
        id: z.number(),
        onTrip: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.update({
        where: {
          id: input.id,
        },
        data: {
          onTrip: input.onTrip,
        },
      });

      return driver;
    }),
});
