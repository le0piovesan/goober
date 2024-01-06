import type { Ride, RideStatus } from "@prisma/client";

type RideStatusLocation = Ride & {
  status: RideStatus;
  pickupLocation: {
    id: number;
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    id: number;
    latitude: number;
    longitude: number;
  };
  rider?: {
    name: string;
    email: string;
  } | null;
  driver?: {
    name: string;
    email: string;
  } | null;
};

type UserRides = RideStatusLocation[] | null;

export type { RideStatusLocation, UserRides };
