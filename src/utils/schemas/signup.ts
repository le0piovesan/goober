import { z } from "zod";
import { File } from "@web-std/file";

export const schema = z.object({
  name: z.string().min(1),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["Rider", "Driver"]),
  type: z.enum(["Regular", "Luxury"]),
  image: z.instanceof(File).refine((file) => file !== null),
});
