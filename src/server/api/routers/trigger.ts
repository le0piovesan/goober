import { z } from "zod";
import { getDistance } from "geolib";
import type { PrismaPromise, PrismaClient } from "@prisma/client";
import type { Notification } from "@prisma/client";

const getRequestClosestDriverInputSchema = z.object({
  rideId: z.number(),
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

type DriverInput = z.infer<typeof getRequestClosestDriverInputSchema>;

const requestClosestDriver = async ({
  db,
  input,
}: {
  db: PrismaClient;
  input: DriverInput;
}): Promise<PrismaPromise<Notification>> => {
  const drivers = await db.driver.findMany({
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

  if (drivers.length === 0) {
    throw new Error("All our drivers are on duty, try again later.");
  }

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

  if (!closestDriver) {
    throw new Error("No drivers available at the moment.");
  }

  const notification = await db.notification.create({
    data: {
      message: "You have a new ride request",
      riderId: null,
      driverId: closestDriver.id,
      rideId: input.rideId,
    },
  });

  return notification;
};

export { requestClosestDriver };
