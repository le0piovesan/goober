import { z } from "zod";

export const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});
