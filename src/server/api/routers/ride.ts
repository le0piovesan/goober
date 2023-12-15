import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Status } from "@prisma/client";
import { getDistance } from "geolib";

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

  createRide: publicProcedure
    .input(
      z.object({
        tripFee: z.number(),
        distance: z.string(),
        originName: z.string(),
        destinationName: z.string(),
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
        try {
          // Check if the rider has an existing ride
          const existingRide = await prisma.ride.findFirst({
            where: {
              riderId: input.riderId,
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
            throw new Error(
              "You already have an open or ongoing ride request.",
            );
          }

          // Create a new ride
          const ride = await prisma.ride.create({
            data: {
              tripFee: input.tripFee,
              distance: input.distance,
              originName: input.originName,
              destinationName: input.destinationName,
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

          // Find available drivers
          const drivers = await prisma.driver.findMany({
            where: {
              onTrip: false,
              NOT: {
                declinedRides: {
                  some: {
                    rideId: ride.id,
                  },
                },
              },
              lastLocationId: {
                not: {}
              }
            },
            include: { lastLocation: true, declinedRides: true },
          });

          if (drivers.length === 0) {
            throw new Error(
              "No drivers near you at this moment, try again later.",
            );
          }

          // Find the closest driver
          const findClosestDriver = async () => {
            const driversWithDistance = [];

            for (const driver of drivers) {
              const distance = getDistance(
                {
                  latitude: input.pickupLocation.latitude,
                  longitude: input.pickupLocation.longitude,
                },
                {
                  latitude: driver.lastLocation.latitude,
                  longitude: driver.lastLocation.longitude,
                },
              );

              driversWithDistance.push({
                ...driver,
                distance,
              });
            }

            driversWithDistance.sort((a, b) => {
              if (a.distance === b.distance) return 0.5 - Math.random();
              return a.distance - b.distance;
            });

            return driversWithDistance[0] ?? null;
          };

          const closestDriver = await findClosestDriver();

          if (!closestDriver) {
            throw new Error("No drivers available at the moment.");
          }

          // Create a notification for the closest driver
          const response = await prisma.notification.create({
            data: {
              message: `You have a new ride request`,
              driver: {
                connect: {
                  id: closestDriver.id,
                },
              },
              ride: {
                connect: {
                  id: ride.id,
                },
              },
            },
          });

          return response;
        } catch (error) {
          throw error;
        }
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
