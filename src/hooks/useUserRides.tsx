import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import type { UserRides } from "~/types/ride";

interface UseUserRidesReturn {
  rides: UserRides;
  isLoading: boolean;
}

const useUserRides = (): UseUserRidesReturn => {
  const { user } = useAuth();
  const [rides, setRides] = useState<UserRides>([]);

  if (!user) return { rides: null, isLoading: false };

  const { isLoading, data } =
    user.type === "Driver"
      ? api.ride.getDriverRides.useQuery({
          id: user.id,
        })
      : api.ride.getRiderRides.useQuery({
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
