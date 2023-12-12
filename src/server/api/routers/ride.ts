import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { requestClosestDriver } from "./trigger";

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
        tripFee: z.number(),
        distance: z.string(),
        pickupLocation: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        dropoffLocation: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        riderId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (prisma) => {
        const ride = await prisma.ride.create({
          data: {
            tripFee: input.tripFee,
            distance: input.distance,
            pickupLocation: {
              create: {
                latitude: input.pickupLocation.latitude,
                longitude: input.pickupLocation.longitude,
              },
            },
            dropoffLocation: {
              create: {
                latitude: input.dropoffLocation.latitude,
                longitude: input.dropoffLocation.longitude,
              },
            },
            rider: {
              connect: {
                id: input.riderId,
              },
            },
          },
        });

        if (!ride) {
          throw new Error("Not able to request a ride, try again later.");
        }

        const { id } = ride;
        const response = await requestClosestDriver({
          db: ctx.db,
          input: {
            rideId: id,
            pickupLocation: input.pickupLocation,
          },
        });
        return response;
      });
    }),
});
