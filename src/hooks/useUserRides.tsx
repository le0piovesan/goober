import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import type { UserRides } from "~/types/ride";
import { useLoading } from "./useLoading";
import supabase from "~/utils/supabaseClient";
import { useRouter } from "next/navigation";

interface UseUserRidesReturn {
  rides: UserRides;
  loading: boolean;
}

const useUserRides = (): UseUserRidesReturn => {
  const { user } = useAuth();
  const [rides, setRides] = useState<UserRides>([]);
  const { loading, startLoading, stopLoading } = useLoading();
  const router = useRouter();

  if (!user) return { rides: null, loading: false };

  const filter = `${user.type === "Driver" ? "driverId" : "riderId"}=eq.${
    user.id
  }`;

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

    const channel = supabase
      .channel("user rides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Ride",
          filter,
        },
        (payload) => {
          if (payload.new) router.refresh();
        },
      )
      .subscribe();

    if (data) {
      setRides(data);
      stopLoading();
    }

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [data, supabase, router]);

  const result = useMemo(() => ({ rides, loading }), [rides, loading]);

  return result;
};

export default useUserRides;
