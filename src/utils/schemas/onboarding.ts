import { z } from "zod";
import { File } from "@web-std/file";

export const schema = z.object({
  fullName: z.string().min(1),
  SSN: z.string().length(11),
  dateOfBirth: z.date(),
  gender: z.enum([
    "Male",
    "Female",
    "Other",
    "Non-Binary",
    "Prefer not to say",
  ]),
  type: z.enum(["Sedan", "SUV", "Truck", "Van"]),
  licensePlate: z.string().min(5).max(7),
  photos: z
    .array(z.any())
    .refine(
      (files) =>
        files.length > 0 &&
        files.every((file) => typeof file === "string" || file instanceof File),
    ),
  features: z.array(z.string()),
  license: z
    .any()
    .refine((file) => typeof file === "string" || file instanceof File),
  insurance: z
    .any()
    .refine((file) => typeof file === "string" || file instanceof File),
  backgroundCheckDocuments: z
    .array(z.any())
    .refine(
      (files) =>
        files.length > 0 &&
        files.every((file) => typeof file === "string" || file instanceof File),
    ),

  professionalCertificate: z
    .any()
    .optional()
    .refine((file) => typeof file === "string" || file instanceof File),

  experience: z.string().min(1),
  referenceLetters: z
    .array(z.any())
    .refine((files) =>
      files.every((file) => typeof file === "string" || file instanceof File),
    ),
  accountNumber: z.string().min(10).max(12),
  routingNumber: z.string().length(9),
  checkNumber: z.string().length(4),
  bankName: z.enum([
    "JPMorgan Chase",
    "Bank of America",
    "Wells Fargo",
    "Citigroup",
    "Goldman Sachs",
  ]),
});
