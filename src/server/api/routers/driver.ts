import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { Status } from "@prisma/client";

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
          lastLocation: {
            create: {
              latitude: 0,
              longitude: 0,
            },
          },
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

  acceptRide: publicProcedure
    .input(
      z.object({
        rideId: z.number(),
        driverId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ride = await ctx.db.ride.findUnique({
        where: {
          id: input.rideId,
        },
        include: {
          status: {},
        },
      });

      if (!ride || ride.status.current !== Status.REQUESTED) {
        throw new Error("This ride is not available anymore");
      }

      if (ride?.driverId) {
        throw new Error("This ride has already been accepted");
      }

      await ctx.db.$transaction([
        ctx.db.ride.update({
          where: {
            id: ride.id,
          },
          data: {
            driverId: input.driverId,
          },
        }),
        ctx.db.driver.update({
          where: {
            id: input.driverId,
          },
          data: {
            onTrip: true,
          },
        }),
        ctx.db.rideStatus.update({
          where: {
            id: ride.id,
          },
          data: {
            current: Status.ONGOING,
            acceptedAt: new Date(),
          },
        }),
        ctx.db.notification.create({
          data: {
            message: "You have accepted the ride",
            driver: {
              connect: {
                id: input.driverId,
              },
            },
            ride: {
              connect: {
                id: ride.id,
              },
            },
          },
        }),
      ]);
    }),
});
