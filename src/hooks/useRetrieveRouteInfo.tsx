import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";

type DistanceDetails = {
  value: number;
  distance: string;
};

type DriverTypes = {
  id: number;
  type: string;
};

const useRetrieveRouteInfo = (
  pickupLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>,
  dropoffLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>,
  setDirections: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >,
  setDistanceDetails: React.Dispatch<React.SetStateAction<DistanceDetails>>,
  setAvailableDrivers: React.Dispatch<React.SetStateAction<DriverTypes[]>>,
  loading: boolean,
  startLoading: () => void,
  stopLoading: () => void,
) => {
  const toast = useToast();
  const { user } = useAuth();
  const drivers = api.ride.searchDrivers.useMutation();

  return useCallback(async () => {
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

    try {
      startLoading();
      const result = await directionService.route({
        origin: pickupLocationRef.current,
        destination: dropoffLocationRef.current,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      const response = await drivers.mutateAsync({
        id: user?.id ?? 0,
        pickupLocation: {
          latitude: pickupLocationRef?.current?.lat ?? 0,
          longitude: pickupLocationRef?.current?.lng ?? 0,
        },
      });

      setAvailableDrivers(response);

      setDirections(result);
      const legs = result.routes[0]?.legs[0];

      setDistanceDetails({
        value: legs?.distance?.value ?? 0,
        distance: legs?.distance?.text ?? "",
      });
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: `${error.message ? error.message : `No route found`} 😢`,
          status: "info",
          position: "top",
          duration: 4000,
          isClosable: true,
        });
    } finally {
      stopLoading();
    }
  }, [
    pickupLocationRef,
    dropoffLocationRef,
    setDirections,
    setDistanceDetails,
    loading,
  ]);
};

export default useRetrieveRouteInfo;
