import { type z } from "zod";
import { getDistance } from "geolib";
import { Status } from "@prisma/client";
import { type PrismaClient } from "@prisma/client";
import type { Driver as PrismaDriver, Location } from "@prisma/client";
import { type getRequestClosestDriverInputSchema } from "~/utils/schemas/routers/trigger";

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

const requestClosestDriver = async ({
  prisma,
  input,
}: {
  prisma: TransactionalPrismaClient;
  input: DriverInput;
}) => {
  // Find all drivers who have not declined this ride yet and are not on ride
  const drivers = await prisma.driver.findMany({
    where: {
      onTrip: false,
      profileCompleted: true,
      tutorialCompleted: true,
      type: input.type,
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
  if (
    drivers.length === 0 ||
    drivers.every(
      (driver) =>
        driver.lastLocation.latitude === 0 ||
        driver.lastLocation.longitude === 0,
    )
  )
    await cancelExistingRideRequest(prisma, input.rideId);
  else {
    const closestDriver = await findClosestDriver(
      drivers,
      input.pickupLocation,
    );

    await sendDriverRideRequestNotification(
      prisma,
      closestDriver,
      input.rideId,
    );
  }
};

const cancelExistingRideRequest = async (
  prisma: TransactionalPrismaClient,
  rideId: number,
) => {
  // Look for the ride requested to get the rider id and the RideStatus id
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    include: { rider: true },
  });

  // Update the status of ride to cancelled
  await prisma.rideStatus.update({
    where: { id: ride?.statusId },
    data: { current: Status.CANCELED, finishedAt: new Date() },
  });

  // Update the updatedAt field of ride
  await prisma.ride.update({
    where: { id: rideId },
    data: { updatedAt: new Date() },
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
};

const findClosestDriver = async (
  drivers: Driver[],
  pickupLocation: PickupLocationInput,
) => {
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
};

const sendDriverRideRequestNotification = async (
  prisma: TransactionalPrismaClient,
  closestDriver: Driver,
  rideId: number,
) => {
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
};

export {
  requestClosestDriver,
  cancelExistingRideRequest,
  findClosestDriver,
  sendDriverRideRequestNotification,
};
