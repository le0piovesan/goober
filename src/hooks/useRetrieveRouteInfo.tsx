import { useCallback } from "react";
import { useLoading } from "./useLoading";
import { useToast } from "@chakra-ui/react";

type DistanceDetails = {
  value: number;
  distance: string;
};

const useRetrieveRouteInfo = (
  pickupLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>,
  dropoffLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>,
  setDirections: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >,
  setDistanceDetails: React.Dispatch<React.SetStateAction<DistanceDetails>>,
) => {
  const { startLoading, stopLoading } = useLoading();
  const toast = useToast();

  return useCallback(async () => {
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

    try {
      const result = await directionService.route({
        origin: pickupLocationRef.current,
        destination: dropoffLocationRef.current,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
      const legs = result.routes[0]?.legs[0];

      setDistanceDetails({
        value: legs?.distance?.value ?? 0,
        distance: legs?.distance?.text ?? "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `No route found 😢`,
        status: "error",
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
  ]);
};

export default useRetrieveRouteInfo;
