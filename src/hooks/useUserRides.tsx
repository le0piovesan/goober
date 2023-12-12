import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import type { UserRides } from "~/types/ride";

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
