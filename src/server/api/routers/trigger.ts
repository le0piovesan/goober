import { z } from "zod";
import { getDistance } from "geolib";
import { Status } from "@prisma/client";
import { type PrismaClient } from "@prisma/client";
import type { Driver as PrismaDriver, Location } from "@prisma/client";

const getRequestClosestDriverInputSchema = z.object({
  rideId: z.number(),
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

type DriverInput = z.infer<typeof getRequestClosestDriverInputSchema>;

type PickupLocationInput = z.infer<
  typeof getRequestClosestDriverInputSchema
>["pickupLocation"];

type Driver = PrismaDriver & {
  lastLocation: Location;
};

type TransactionalPrismaClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

const findAvailableDrivers = async ({
  prisma,
  input,
}: {
  prisma: TransactionalPrismaClient;
  input: DriverInput;
}) => {
  try {
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

    return drivers;
  } catch (error) {
    throw error;
  }
};

const requestClosestDriver = async ({
  prisma,
  drivers,
  input,
}: {
  prisma: TransactionalPrismaClient;
  drivers: Driver[];
  input: DriverInput;
}) => {
  try {
    const closestDriver = await findClosestDriver(
      drivers,
      input.pickupLocation,
    );

    await sendDriverRideRequestNotification(
      prisma,
      closestDriver,
      input.rideId,
    );
  } catch (error) {
    throw error;
  }
};

const cancelExistingRideRequest = async (
  prisma: TransactionalPrismaClient,
  rideId: number,
) => {
  try {
    // Update the status of ride to cancelled
    await prisma.rideStatus.update({
      where: { id: rideId },
      data: { current: Status.CANCELED, finishedAt: new Date() },
    });

    // Look for the ride requested to get the rider id
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: { rider: true },
    });

    // Notify the rider that his ride was cancelled
    await prisma.notification.create({
      data: {
        message: "No drivers available at the moment, try again later.",
        rider: {
          connect: {
            id: ride?.riderId,
          },
        },
        ride: {
          connect: {
            id: ride?.id,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

const findClosestDriver = async (
  drivers: Driver[],
  pickupLocation: PickupLocationInput,
) => {
  try {
    const driversWithDistance = [];
    // Get distance between pickup location and available drivers last location
    for (const driver of drivers) {
      const distance = getDistance(
        {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
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
    // Sort drivers by distance to check the closest one, if there are more than one, pick one randomly
    driversWithDistance.sort((a, b) => {
      if (a.distance === b.distance) return 0.5 - Math.random();
      return a.distance - b.distance;
    });

    return driversWithDistance[0]!;
  } catch (error) {
    throw error;
  }
};

const sendDriverRideRequestNotification = async (
  prisma: TransactionalPrismaClient,
  closestDriver: Driver,
  rideId: number,
) => {
  try {
    // Notify the closest driver, sending the ride request
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
            id: rideId,
          },
        },
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export {
  findAvailableDrivers,
  requestClosestDriver,
  cancelExistingRideRequest,
  findClosestDriver,
  sendDriverRideRequestNotification,
};
