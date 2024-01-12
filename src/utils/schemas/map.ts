import { z } from "zod";

export const schema = z.object({
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
});
