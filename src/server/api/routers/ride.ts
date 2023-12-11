import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const rideRouter = createTRPCRouter({
  getRiderRides: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const riderRides = await ctx.db.ride.findMany({
        where: {
          riderId: input.id,
        },
        include: {
          pickupLocation: true,
          dropoffLocation: true,
        },
      });

      return riderRides;
    }),

  getDriverRides: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const driverRides = await ctx.db.ride.findMany({
        where: {
          driverId: input.id,
        },
        include: {
          pickupLocation: true,
          dropoffLocation: true,
        },
      });

      return driverRides;
    }),

  createRide: publicProcedure
    .input(
      z.object({
        pickupLocation: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
        dropoffLocation: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
        tripFee: z.number(),
        duration: z.number(),
        riderId: z.number(),
        driverId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ride = await ctx.db.ride.create({
        data: {
          status: "requested",
          pickupLocation: input.pickupLocation,
          dropoffLocation: input.dropoffLocation,
          tripFee: input.tripFee,
          duration: input.duration,
          riderId: input.riderId,
          driverId: input.driverId,
        },
      });

      return ride;
    }),

  updateRide: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ride = await ctx.db.ride.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      return ride;
    }),
});
