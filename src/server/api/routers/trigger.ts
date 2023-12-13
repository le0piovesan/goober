import { z } from "zod";
import { getDistance } from "geolib";
import type { Prisma, PrismaPromise, PrismaClient } from "@prisma/client";
import type { Notification } from "@prisma/client";
import { Status } from "@prisma/client";

const getRequestClosestDriverInputSchema = z.object({
  rideId: z.number(),
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

type DriverInput = z.infer<typeof getRequestClosestDriverInputSchema>;

const sendDriverRideRequestNotificationSchema = z.object({
  message: z.string(),
  driverId: z.number(),
  rideId: z.number(),
});

type NotificationInput = z.infer<
  typeof sendDriverRideRequestNotificationSchema
>;

type TransactionalPrismaClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

const requestClosestDriver = async ({
  db,
  input,
}: {
  db: TransactionalPrismaClient;
  input: DriverInput;
}): Promise<Prisma.Prisma__NotificationClient<Notification>> => {
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
    throw new Error("No drivers found, try again later.");
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

  driversWithDistance.sort((a, b) => {
    if (a.distance === b.distance) return 0.5 - Math.random();
    return a.distance - b.distance;
  });

  const closestDriver = driversWithDistance[0];

  if (!closestDriver) {
    throw new Error("No drivers available at the moment.");
  }

  const declinedRides = await db.declinedRide.findMany({
    where: {
      rideId: input.rideId,
    },
  });

  if (!closestDriver && declinedRides.length > 0) {
    await cancelExistingRideRequest(db, input.rideId);
  }

  const response = await sendDriverRideRequestNotification({
    db,
    input: {
      message: `You have a new ride request`,
      driverId: closestDriver.id,
      rideId: input.rideId,
    },
  });

  return response;
};

const sendDriverRideRequestNotification = async ({
  db,
  input,
}: {
  db: TransactionalPrismaClient;
  input: NotificationInput;
}): Promise<PrismaPromise<Notification>> => {
  const response = await db.notification.create({
    data: {
      message: input.message,
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

  return response;
};

const cancelExistingRideRequest = async (
  db: TransactionalPrismaClient,
  rideId: number,
) => {
  const ride = await db.ride.findUnique({
    where: {
      id: rideId,
    },
    include: {
      status: {},
    },
  });

  if (!ride) return;

  await db.rideStatus.update({
    where: {
      id: ride.statusId,
    },
    data: {
      current: Status.CANCELED,
      finishedAt: new Date(),
    },
  });

  await db.notification.create({
    data: {
      message: "No drivers available at the moment, try again later.",
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
};

export { requestClosestDriver, sendDriverRideRequestNotification };
