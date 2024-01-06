import { Text } from "@chakra-ui/react";
import React from "react";
import DateInput from "~/components/DateInput";
import InputComponent from "~/components/InputComponent";
import RadioComponent from "~/components/RadioComponent";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

type DriverPersonalInfoProps = {
  register: UseFormRegister<FormOnboardingData>;
  errors: FieldErrors<FormOnboardingData>;
  control: Control<FormOnboardingData>;
};

type FormOnboardingData = {
  fullName: string;
  SSN: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other" | "Non-Binary" | "Prefer not to say";
};

const DriverPersonalInfo: React.FC<DriverPersonalInfoProps> = ({
  register,
  errors,
  control,
}) => {
  return (
    <>
      <Text textAlign={"center"}>
        Before you become eligible to receive ride requests, we need some
        additional information to ensure that we provide the best service for
        all our users.
      </Text>

      <InputComponent
        label="Full Name"
        name="fullName"
        placeholder="Full Name"
        register={register}
        error={errors.fullName}
      />
      <InputComponent
        label="Social Security Number (SSN)"
        name="SSN"
        placeholder="___-__-____"
        mask="999-99-9999"
        maskChar={null}
        register={register}
        error={errors.SSN}
      />
      <DateInput
        label="Date of Birth"
        control={control}
        name="dateOfBirth"
        error={errors.dateOfBirth}
      />
      <RadioComponent
        label="Gender"
        control={control}
        name="gender"
        defaultValue="Male"
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" },
          { value: "Non-Binary", label: "Non-Binary" },
          { value: "Prefer not to say", label: "Prefer not to say" },
        ]}
      />
    </>
  );
};

export default DriverPersonalInfo;
