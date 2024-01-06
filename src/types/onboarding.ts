import {
  type UseFormRegister,
  type FieldErrors,
  type Control,
} from "react-hook-form";

type FormOnboardingData = {
  fullName: string;
  SSN: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other" | "Non-Binary" | "Prefer not to say";
  type: "Sedan" | "SUV" | "Truck" | "Van";
  licensePlate: string;
  photos: File[];
  features: string[];
};

type OnboardingStepProps = {
  register: UseFormRegister<FormOnboardingData>;
  errors: FieldErrors<FormOnboardingData>;
  control: Control<FormOnboardingData>;
};

export type { FormOnboardingData, OnboardingStepProps };
