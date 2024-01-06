import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { useEffect, useMemo } from "react";
import type { UserRides } from "~/types/ride";
import supabase from "~/utils/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { type QueryKey } from "react-query";

interface UseUserRidesReturn {
  rides: UserRides | null | undefined;
  isFetching: boolean;
}

const useUserRides = (): UseUserRidesReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!user) return { rides: null, isFetching: false };

  const filter = `${user.type === "Driver" ? "driverId" : "riderId"}=eq.${
    user.id
  }`;

  const queryKey: QueryKey =
    user.type === "Driver"
      ? getQueryKey(api.ride.getDriverRides, { id: user.id }, "query")
      : getQueryKey(api.ride.getRiderRides, { id: user.id }, "query");

  const { data: rides, isLoading: isFetching } =
    user.type === "Driver"
      ? api.ride.getDriverRides.useQuery({
          id: user.id,
        })
      : api.ride.getRiderRides.useQuery({
          id: user.id,
        });

  useEffect(() => {
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

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, queryKey, rides]);

  const result = useMemo(() => ({ rides, isFetching }), [rides, isFetching]);

  return result;
};

export default useUserRides;
