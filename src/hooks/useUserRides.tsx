import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useEffect, useMemo } from "react";
import type { UserRides } from "~/types/ride";
import { useLoading } from "./useLoading";
import supabase from "~/utils/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { type QueryKey } from "react-query";

interface UseUserRidesReturn {
  rides: UserRides | null | undefined;
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const useUserRides = (): UseUserRidesReturn => {
  const { user } = useAuth();
  const { loading, startLoading, stopLoading } = useLoading();
  const queryClient = useQueryClient();

  if (!user) return { rides: null, loading: false, startLoading, stopLoading };

  const filter = `${user.type === "Driver" ? "driverId" : "riderId"}=eq.${
    user.id
  }`;

  const queryKey: QueryKey =
    user.type === "Driver"
      ? getQueryKey(api.ride.getDriverRides, { id: user.id }, "query")
      : getQueryKey(api.ride.getRiderRides, { id: user.id }, "query");

  const { data: rides } =
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
        () => {
          void queryClient.invalidateQueries(queryKey);
        },
      )
      .subscribe();

    if (rides) stopLoading();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, queryKey, rides, startLoading, stopLoading]);

  const result = useMemo(
    () => ({ rides, loading, startLoading, stopLoading }),
    [rides, loading, startLoading, stopLoading],
  );

  return result;
};

export default useUserRides;
