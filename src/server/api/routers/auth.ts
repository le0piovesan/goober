import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingDriver = await ctx.db.driver.findUnique({
        where: { email: input.email },
      });

      const existingRider = await ctx.db.rider.findUnique({
        where: { email: input.email },
      });

      const user = existingDriver ?? existingRider;
      const type = existingDriver ? "Driver" : "Rider";

      if (!user) {
        throw new Error("No user with this email exists");
      }

      if (!bcrypt.compareSync(input.password, user.password)) {
        throw new Error("Incorrect password");
      }

      return {
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        profileCompleted: user.profileCompleted,
        type,
      };
    }),
});
