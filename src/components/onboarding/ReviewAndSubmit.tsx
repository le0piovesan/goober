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
  driverId,
  startLoading,
  stopLoading,
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
        driverId={driverId}
        startLoading={startLoading}
        stopLoading={stopLoading}
      />

      <Documents
        review
        register={register}
        errors={errors}
        control={control}
        driverId={driverId}
        startLoading={startLoading}
        stopLoading={stopLoading}
      />

      <DrivingHistory
        review
        register={register}
        errors={errors}
        control={control}
        driverId={driverId}
        startLoading={startLoading}
        stopLoading={stopLoading}
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
