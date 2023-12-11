import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  getNotifications: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findMany({
        where: {
          id: input.id,
        },
      });

      return notification;
    }),
});
