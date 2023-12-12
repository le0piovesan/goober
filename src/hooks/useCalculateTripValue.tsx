import { useMemo } from "react";

const useCalculateTripValue = (distanceInMeters: number) => {
  return useMemo(() => {
    const distanceInKm = distanceInMeters / 1000;
    const baseFee = 0.32;
    const quote = 1.2;
    const value = distanceInKm * baseFee * quote;
    return Number(value.toFixed(2));
  }, [distanceInMeters]);
};

export default useCalculateTripValue;
