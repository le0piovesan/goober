import type { Ride, RideStatus } from "@prisma/client";

type RideWithStatus = Ride & {
  status: RideStatus;
};

type UserRides = RideWithStatus[] | null;

export type { RideWithStatus, UserRides };
