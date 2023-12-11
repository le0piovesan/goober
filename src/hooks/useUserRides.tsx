import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect, useMemo } from "react";

type Location = {
  latitude: number;
  longitude: number;
};

type Ride = {
  id: number;
  status: string;
  pickupLocation: Location;
  pickupLocationId: number;
  dropoffLocation: Location;
  dropoffLocationId: number;
  tripFee: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
};

type UserRides = Ride[];

const useUserRides = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState<UserRides | null>(null);

  if (!user) return { rides: null, isLoading: false };

  const { isLoading, data } =
    user.type === "Rider"
      ? api.ride.getRiderRides.useQuery({
          id: user.id,
        })
      : api.ride.getDriverRides.useQuery({
          id: user.id,
        });

  useEffect(() => {
    if (data) {
      setRides(data);
    }
  }, [data]);

  const result = useMemo(() => ({ rides, isLoading }), [rides, isLoading]);

  return result;
};

export default useUserRides;
