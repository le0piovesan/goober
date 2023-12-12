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
  acceptedAt: Date;
  finishedAt: Date;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
};

type UserRides = Ride[];

export type { Ride, UserRides };
