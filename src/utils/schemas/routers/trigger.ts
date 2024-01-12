import { z } from "zod";

export const getRequestClosestDriverInputSchema = z.object({
  rideId: z.number(),
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  type: z.enum(["Regular", "Luxury"]),
});
