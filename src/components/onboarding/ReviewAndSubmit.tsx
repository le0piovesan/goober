import { Text } from "@chakra-ui/react";
import React from "react";
import type { OnboardingStepProps } from "~/types/onboarding";
import DriverPersonalInfo from "~/components/onboarding/DriverPersonalInfo";
import VehicleInformation from "~/components/onboarding/VehicleInformation";
import Documents from "~/components/onboarding/Documents";
import DrivingHistory from "~/components/onboarding/DrivingHistory";
import BankInformation from "~/components/onboarding/BankInformation";

const ReviewAndSubmit: React.FC<OnboardingStepProps> = ({
  register,
  errors,
  control,
}) => {
  return (
    <>
      <Text textAlign={"center"}>
        Review all the provided information, make changes if necessary and
        submit your profile.
      </Text>

      <DriverPersonalInfo
        review
        register={register}
        errors={errors}
        control={control}
      />

      <VehicleInformation
        review
        register={register}
        errors={errors}
        control={control}
      />

      <Documents review register={register} errors={errors} control={control} />

      <DrivingHistory
        review
        register={register}
        errors={errors}
        control={control}
      />

      <BankInformation
        review
        register={register}
        errors={errors}
        control={control}
      />
    </>
  );
};

export default ReviewAndSubmit;
