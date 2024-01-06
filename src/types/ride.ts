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
  };
  driver?: {
    name: string;
    email: string;
  };
};

type UserRides = RideStatusLocation[] | null;

export type { RideStatusLocation, UserRides };
