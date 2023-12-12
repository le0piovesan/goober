import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getDistance } from "geolib";

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

  requestClosestDriver: publicProcedure
    .input(
      z.object({
        rideId: z.number(),
        pickupLocation: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const drivers = await ctx.db.driver.findMany({
        where: {
          onTrip: false,
          declinedRides: {
            none: {
              rideId: input.rideId,
            },
          },
        },
        include: { lastLocation: true },
      });

      //
      const driversWithDistance = drivers.map((driver) => ({
        ...driver,
        distance: getDistance(
          {
            latitude: input.pickupLocation.latitude,
            longitude: input.pickupLocation.longitude,
          },
          {
            latitude: driver.lastLocation.latitude,
            longitude: driver.lastLocation.longitude,
          },
        ),
      }));

      driversWithDistance.sort((a, b) => a.distance - b.distance);

      const closestDriver = driversWithDistance[0];

      // const notification = await sendNotification(
      //   closestDriver,
      //   "You have a new ride request",
      // );

      // return notification;
    }),
});
