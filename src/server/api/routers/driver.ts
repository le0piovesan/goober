import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { Status } from "@prisma/client";
import { requestClosestDriver } from "./trigger";

export const driverRouter = createTRPCRouter({
  checkDriverTutorialStatus: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.findUnique({
        where: {
          id: input.id,
        },
        select: {
          tutorialCompleted: true,
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
        type: z.enum(["Regular", "Luxury"]),
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
          type: input.type,
          image: input.image,
        },
      });

      return driver;
    }),

  completeDriverProfile: publicProcedure
    .input(
      z.object({
        id: z.number(),
        fullName: z.string(),
        SSN: z.string(),
        dateOfBirth: z.date(),
        gender: z.string(),
        type: z.string(),
        licensePlate: z.string(),
        photosPaths: z.array(z.string()),
        features: z.array(z.string()),
        licensePath: z.string(),
        insurancePath: z.string(),
        backgroundCheckDocumentsPaths: z.array(z.string()),
        professionalCertificatePath: z.string().optional(),
        experience: z.string(),
        referenceLettersPaths: z.array(z.string()),
        accountNumber: z.string(),
        routingNumber: z.string(),
        checkNumber: z.string(),
        bankName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.update({
        where: { id: input.id },
        data: {
          fullName: input.fullName,
          SSN: input.SSN,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          type: input.type,
          profileCompleted: true,
          vehicle: {
            create: {
              type: input.type,
              licensePlate: input.licensePlate,
              photos: input.photosPaths,
              features: input.features,
            },
          },
          documents: {
            create: {
              license: input.licensePath,
              insurance: input.insurancePath,
              backgroundCheckDocuments: input.backgroundCheckDocumentsPaths,
              professionalCertificate: input.professionalCertificatePath,
            },
          },
          drivingHistory: {
            create: {
              experience: input.experience,
              referenceLetters: input.referenceLettersPaths,
            },
          },
          bank: {
            create: {
              accountNumber: input.accountNumber,
              routingNumber: input.routingNumber,
              checkNumber: input.checkNumber,
              bankName: input.bankName,
            },
          },
        },
        include: {
          vehicle: true,
          documents: true,
          drivingHistory: true,
          bank: true,
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
        type: z.enum(["Regular", "Luxury"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Decline the ride
      await ctx.db.declinedRide.create({
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
      await ctx.db.notification.create({
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

      await requestClosestDriver({
        prisma: ctx.db,
        input: {
          rideId: input.rideId,
          pickupLocation: input.pickupLocation,
          type: input.type,
        },
      });
    }),
});
