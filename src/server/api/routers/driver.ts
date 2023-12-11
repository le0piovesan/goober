import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";

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
          password: bcrypt.hashSync(input.password, 10),
        },
      });

      return driver;
    }),

  updateDriverLastLocation: publicProcedure
    .input(
      z.object({
        id: z.number(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.findUnique({
        where: {
          id: input.id,
        },
        include: {
          lastLocation: true,
        },
      });

      if (!driver?.lastLocation) {
        throw new Error("Driver does not have a last location");
      }

      await ctx.db.location.update({
        where: {
          id: driver.lastLocation.id,
        },
        data: {
          latitude: input.latitude,
          longitude: input.longitude,
        },
      });
    }),
});
