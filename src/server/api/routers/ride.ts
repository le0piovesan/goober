import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Status } from "@prisma/client";
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
          status: {},
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
          status: {},
        },
      });

      return driverRides;
    }),

  searchDrivers: publicProcedure
    .input(
      z.object({
        id: z.number(),
        pickupLocation: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the rider has an existing ride
      const existingRide = await ctx.db.ride.findFirst({
        where: {
          riderId: input.id,
          status: {
            OR: [
              {
                current: Status.REQUESTED,
              },
              {
                current: Status.ONGOING,
              },
            ],
          },
        },
      });

      if (existingRide) {
        throw new Error("You already have an open or ongoing ride request.");
      }

      // Find all drivers who are currently not on a ride
      const drivers = await ctx.db.driver.findMany({
        where: {
          onTrip: false,
        },
        include: { lastLocation: true },
      });

      // Rollback and inform client that there are no drivers available
      if (
        drivers.length === 0 ||
        drivers.every(
          (driver) =>
            driver.lastLocation.latitude === 0 ||
            driver.lastLocation.longitude === 0,
        )
      ) {
        throw new Error(
          "No available drivers at this moment, try again later.",
        );
      }

      return drivers.map((driver) => ({
        id: driver.id,
        type: driver.type,
      }));
    }),

  createRide: publicProcedure
    .input(
      z.object({
        tripFee: z.number(),
        distance: z.string(),
        originName: z.string(),
        destinationName: z.string(),
        type: z.enum(["Regular", "Luxury"]),
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
      const ride = await ctx.db.ride.create({
        data: {
          tripFee: input.tripFee,
          distance: input.distance,
          originName: input.originName,
          destinationName: input.destinationName,
          type: input.type,
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
          status: {
            create: {},
          },
        },
      });

      await requestClosestDriver({
        prisma: ctx.db,
        input: {
          rideId: ride.id,
          pickupLocation: input.pickupLocation,
          type: input.type,
        },
      });
    }),

  cancelRide: publicProcedure
    .input(z.object({ id: z.number(), userType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ride = await ctx.db.ride.findFirst({
        where: {
          id: input.id,
          status: {
            current: Status.ONGOING,
          },
        },
      });

      if (!ride) {
        throw new Error("Ride not found.");
      }

      const updatedRide = await ctx.db.rideStatus.update({
        where: {
          id: ride.id,
        },
        data: {
          current: Status.CANCELED,
          acceptedAt: new Date(),
        },
      });

      if (!ride.driverId) {
        throw new Error("Driver not found.");
      }

      await ctx.db.driver.update({
        where: {
          id: ride.driverId,
        },
        data: {
          onTrip: false,
        },
      });

      await ctx.db.notification.create({
        data: {
          message: `The ride has been canceled by the ${input.userType}`,
          driver: {
            connect: {
              id: ride.driverId,
            },
          },
          rider: {
            connect: {
              id: ride.riderId,
            },
          },
          ride: {
            connect: {
              id: ride.id,
            },
          },
        },
      });

      return updatedRide;
    }),
});
