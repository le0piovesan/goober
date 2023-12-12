import { useCallback } from "react";
import { useLoading } from "./useLoading";

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

  return useCallback(async () => {
    startLoading();
    const directionService = new google.maps.DirectionsService();

    if (!pickupLocationRef.current || !dropoffLocationRef.current) {
      console.error("Pickup or dropoff location is not set");
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
      console.log(error);
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
