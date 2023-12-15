import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { getDistance } from "geolib";
import { Status } from "@prisma/client";
import input from "postcss/lib/input";

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
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        image: z.string(),
      }),
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
          image: input.image,
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
      const driver = await ctx.db.driver.findUnique({
        where: {
          id: input.driverId,
        },
      });

      if (driver?.onTrip) {
        throw new Error("You are already on a trip");
      }

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
        ctx.db.notification.create({
          data: {
            message: "Your ride has been accepted!",
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
        }),
      ]);
    }),

  declineRide: publicProcedure
    .input(
      z.object({
        rideId: z.number(),
        driverId: z.number(),
        pickupLocation: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (prisma) => {
        try {
          // Decline the ride
          await prisma.declinedRide.create({
            data: {
              driver: {
                connect: {
                  id: input.driverId,
                },
              },
              ride: {
                connect: {
                  id: input.rideId,
                },
              },
            },
          });

          // Notify the driver that he has declined this ride
          await prisma.notification.create({
            data: {
              message: "You have declined this ride",
              driver: {
                connect: {
                  id: input.driverId,
                },
              },
              ride: {
                connect: {
                  id: input.rideId,
                },
              },
            },
          });

          // Find the rider who requested this ride
          const rider = await prisma.ride.findFirst({
            where: { id: input.rideId },
            include: { rider: true },
          });

          // Find all drivers who have not declined this ride yet and are not on ride
          const drivers = await prisma.driver.findMany({
            where: {
              onTrip: false,
              NOT: {
                declinedRides: {
                  some: {
                    rideId: input.rideId,
                  },
                },
              },
            },
            include: { lastLocation: true },
          });

          // If there are no other drivers available, update the status of ride to cancelled
          if (drivers.length === 0 || drivers.some(driver => driver.lastLocation.latitude === 0 || driver.lastLocation.longitude === 0)) {
            await prisma.rideStatus.update({
              where: { id: input.rideId },
              data: { current: Status.CANCELED, finishedAt: new Date() },
            });

            // Notify the rider that his ride was cancelled
            await prisma.notification.create({
              data: {
                message: "No drivers available at the moment, try again later.",
                riderId: rider?.id,
              },
            });
          } else {
            // If there are drivers, find the closest one
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

            // Notify the closest driver, sending the ride request
            await prisma.notification.create({
              data: {
                message: `You have a new ride request`,
                driver: {
                  connect: {
                    id: closestDriver?.id,
                  },
                },
                ride: {
                  connect: {
                    id: input.rideId,
                  },
                },
              },
            });
          }
        } catch (error) {
          throw error;
        }
      });
    }),
});
