import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import type { UserRides } from "~/types/ride";
import { useLoading } from "./useLoading";

interface UseUserRidesReturn {
  rides: UserRides;
  loading: boolean;
}

const useUserRides = (): UseUserRidesReturn => {
  const { user } = useAuth();
  const [rides, setRides] = useState<UserRides>([]);
  const { loading, startLoading, stopLoading } = useLoading();

  if (!user) return { rides: null, loading: false };

  const { data } =
    user.type === "Driver"
      ? api.ride.getDriverRides.useQuery({
          id: user.id,
        })
      : api.ride.getRiderRides.useQuery({
          id: user.id,
        });

  useEffect(() => {
    startLoading();
    if (data) {
      setRides(data);
      stopLoading();
    }
  }, [data]);

  const result = useMemo(() => ({ rides, loading }), [rides, loading]);

  return result;
};

export default useUserRides;
