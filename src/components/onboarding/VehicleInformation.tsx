import { Text } from "@chakra-ui/react";
import React from "react";
import InputComponent from "~/components/InputComponent";
import RadioComponent from "~/components/RadioComponent";
import type { OnboardingStepProps } from "~/types/onboarding";

import FileUpload from "../FileUploadInput";

const VehicleInformation: React.FC<OnboardingStepProps> = ({
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
          For now you can have only vehicle, so fill out the information about
          the vehicle you will be using.
        </Text>
      )}

      <RadioComponent
        label="Vehicle Type"
        control={control}
        name="type"
        select
        defaultValue="Sedan"
        options={[
          { value: "Sedan", label: "Sedan" },
          { value: "SUV", label: "SUV" },
          { value: "Truck", label: "Truck" },
          { value: "Van", label: "Van" },
        ]}
      />
      {errors.type && (
        <Text fontSize="xs" color="red">
          You must select a type
        </Text>
      )}

      <InputComponent
        label="License Plate"
        name="licensePlate"
        placeholder="License Plate"
        register={register}
        error={errors.licensePlate}
        maxLength={7}
      />

      <FileUpload
        control={control}
        name="photos"
        label="Upload Photos"
        placeholder="Upload Photos"
        required={true}
        multiple={true}
        startLoading={startLoading}
        stopLoading={stopLoading}
        driverId={driverId}
      />
      {errors.photos && (
        <Text fontSize="xs" color="red">
          At least one photo must be uploaded
        </Text>
      )}

      <RadioComponent
        label="Features"
        control={control}
        name="features"
        checkbox
        options={[
          { value: "Wi-Fi", label: "Wi-Fi" },
          { value: "Water Bottles", label: "Water Bottles" },
          { value: "USB Port", label: "USB Port" },
          { value: "Fruits", label: "Fruits" },
          { value: "Candy", label: "Candy" },
        ]}
      />
    </>
  );
};

export default VehicleInformation;
