import { useCallback, useEffect, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import supabase from "~/utils/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { type QueryKey } from "react-query";

type DistanceDetails = {
  value: number;
  distance: string;
};

type DriverTypes = {
  id: number;
  type: string;
};

interface UseRetrieveRouteInfoProps {
  pickupLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>;
  dropoffLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>;
  setDirections: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >;
  setDistanceDetails: React.Dispatch<React.SetStateAction<DistanceDetails>>;
  startLoading: () => void;
  stopLoading: () => void;
}

interface UseRetrieveRouteInfoReturn {
  retrieveRouteInfo: () => Promise<void>;
  availableDrivers: DriverTypes[];
  isFetching: boolean;
}

const useRetrieveRouteInfo = ({
  pickupLocationRef,
  dropoffLocationRef,
  setDirections,
  setDistanceDetails,
  startLoading,
  stopLoading,
}: UseRetrieveRouteInfoProps): UseRetrieveRouteInfoReturn => {
  const toast = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!user)
    return {
      retrieveRouteInfo: () => Promise.resolve(),
      availableDrivers: [],
      isFetching: false,
    };

  const queryKey: QueryKey = getQueryKey(
    api.ride.searchDrivers,
    {
      id: user?.id ?? 0,
      pickupLocation: {
        latitude: pickupLocationRef?.current?.lat ?? 0,
        longitude: pickupLocationRef?.current?.lng ?? 0,
      },
    },
    "query",
  );

  const { data: availableDrivers, isLoading: isFetching } =
    api.ride.searchDrivers.useQuery({
      id: user?.id ?? 0,
      pickupLocation: {
        latitude: pickupLocationRef?.current?.lat ?? 0,
        longitude: pickupLocationRef?.current?.lng ?? 0,
      },
    });

  const retrieveRouteInfo = useCallback(async () => {
    startLoading();

    const directionService = new google.maps.DirectionsService();

    if (!pickupLocationRef.current || !dropoffLocationRef.current) {
      toast({
        title: "Warning",
        description: "Pickup or Dropoff location is not set 📍",
        position: "top",
        status: "info",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const directionsResult = await directionService.route({
      origin: pickupLocationRef.current,
      destination: dropoffLocationRef.current,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirections(directionsResult);
    const legs = directionsResult.routes[0]?.legs[0];

    setDistanceDetails({
      value: legs?.distance?.value ?? 0,
      distance: legs?.distance?.text ?? "",
    });

    void queryClient.refetchQueries(queryKey);

    stopLoading();
  }, [
    pickupLocationRef,
    dropoffLocationRef,
    setDirections,
    setDistanceDetails,
    queryClient,
    queryKey,
    toast,
  ]);

  useEffect(() => {
    const channels = availableDrivers?.map((driver) => {
      const channel = supabase
        .channel(`driver-${driver.id}-changes`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Driver",
            filter: `id=eq.${driver.id}`,
          },
          () => void retrieveRouteInfo(),
        )
        .subscribe();

      return channel;
    });

    return () => {
      channels?.forEach((channel) => {
        void supabase.removeChannel(channel);
      });
    };
  }, [supabase, queryKey, availableDrivers]);

  const result = useMemo(
    () => ({ availableDrivers: availableDrivers ?? [], isFetching }),
    [availableDrivers, isFetching],
  );
  return { retrieveRouteInfo, ...result };
};

export default useRetrieveRouteInfo;
