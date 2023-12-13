import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  getDriverNotifications: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findMany({
        where: {
          driverId: input.id,
        },
        include: {
          ride: {
            select: {
              tripFee: true,
              status: true,
              originName: true,
              pickupLocation: true,
              updatedAt: true,
            },
          },
        },
      });

      return notification;
    }),

  getRiderNotifications: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.findMany({
        where: {
          riderId: input.id,
        },
        include: {
          ride: {
            select: {
              tripFee: true,
              status: true,
              originName: true,
              pickupLocation: true,
              updatedAt: true,
            },
          },
        },
      });

      return notification;
    }),
});
