import { useMemo } from "react";

const useCalculateTripValue = (
  distanceInMeters: number,
  driverType: "Regular" | "Luxury" = "Regular",
) => {
  return useMemo(() => {
    const distanceInKm = distanceInMeters / 1000;
    const baseFee = 0.32;
    const quote = driverType === "Luxury" ? 1.2 : 1;
    const value = distanceInKm * baseFee * quote;
    return Number(value.toFixed(2));
  }, [distanceInMeters, driverType]);
};

export default useCalculateTripValue;
