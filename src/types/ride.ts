type Location = {
  latitude: number;
  longitude: number;
};

type Ride = {
  id: number;
  status: string;
  tripFee: number;
  distance: string;
  pickupLocation: Location;
  pickupLocationId: number;
  dropoffLocation: Location;
  dropoffLocationId: number;
  acceptedAt: Date | null;
  finishedAt: Date | null;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserRides = Ride[];

export type { Ride, UserRides };
