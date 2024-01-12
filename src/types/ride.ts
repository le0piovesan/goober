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
    fullName: string | null;
    email: string;
    gender: string;
    vehicle?: {
      id: number;
      type: string;
      licensePlate: string;
      photos: string[];
      features: string[];
    } | null;
    drivingHistory?: {
      experience: string;
    } | null;
  } | null;
};

type UserRides = RideStatusLocation[] | null;

export type { RideStatusLocation, UserRides };
