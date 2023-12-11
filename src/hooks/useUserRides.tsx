import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useCallback, useEffect } from "react";
import { useLoading } from "./useLoading";

type Ride = {
  id: number;
  status: string;
  pickupLocationId: number;
  dropoffLocationId: number;
  tripFee: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  riderId: number;
  driverId: number;
};

const useUserRides = () => {
  const { user } = useAuth();
  const { startLoading, stopLoading, loading } = useLoading();
  const [rides, setRides] = useState<Ride[]>([]);
  const riderRides = user
    ? api.ride.getRiderRides.useQuery({ id: user.id })
    : null;
  const driverRides = user
    ? api.ride.getDriverRides.useQuery({ id: user.id })
    : null;

  const fetchRides = useCallback(() => {
    if (!user) {
      return;
    }

    startLoading();

    try {
      let fetchedRides: Ride[] = [];

      if (user && (user.type === "Rider" || user.type === "Driver")) {
        const result = user.type === "Rider" ? riderRides : driverRides;

        if (result) fetchedRides = result.data ?? [];
      }

      setRides(fetchedRides);
    } catch (error) {
      console.error("Failed to fetch rides:", error);
      throw error;
    } finally {
      stopLoading();
    }
  }, [user]);

  useEffect(() => {
    fetchRides();
    console.log("test useeffect");
  }, []);

  return { rides, loading };
};

export default useUserRides;
