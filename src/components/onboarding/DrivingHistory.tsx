import { Text } from "@chakra-ui/react";
import React from "react";
import InputComponent from "~/components/InputComponent";
import type { OnboardingStepProps } from "~/types/onboarding";
import FileUpload from "../FileUploadInput";

const DrivingHistory: React.FC<OnboardingStepProps> = ({
  register,
  errors,
  control,
  review,
  driverId,
  startLoading,
  stopLoading,
}) => {
  return (
    <>
      {!review && (
        <Text textAlign={"center"}>
          Describe your past driving experience and optionally upload reference
          letters.
        </Text>
      )}

      <InputComponent
        label="Past Driving Experiences"
        name="experience"
        placeholder="Feel free to use this field to describe your past driving experiences."
        textarea
        register={register}
        error={errors.experience}
      />

      <FileUpload
        control={control}
        name="referenceLetters"
        label="Reference Letters"
        placeholder="Reference Letters"
        required={true}
        multiple={true}
        docs={true}
        startLoading={startLoading}
        stopLoading={stopLoading}
        driverId={driverId}
      />
    </>
  );
};

export default DrivingHistory;
