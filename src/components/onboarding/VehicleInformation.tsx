import { HStack, Text } from "@chakra-ui/react";
import React from "react";
import { Controller } from "react-hook-form";
import InputComponent from "~/components/InputComponent";
import RadioComponent from "~/components/RadioComponent";
import type { OnboardingStepProps } from "~/types/onboarding";
import ButtonComponent from "../ButtonComponent";

const VehicleInformation: React.FC<OnboardingStepProps> = ({
  register,
  errors,
  control,
}) => {
  return (
    <>
      <Text textAlign={"center"}>
        For now you can have only vehicle, so fill out the information about the
        vehicle you will be using.
      </Text>

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

      <InputComponent
        label="License Plate"
        name="licensePlate"
        placeholder="License Plate"
        register={register}
        error={errors.licensePlate}
        maxLength={7}
      />

      <Controller
        control={control}
        name="photos"
        rules={{ required: true }}
        render={({ field }) => (
          <>
            <InputComponent
              label="Upload Photos"
              name="photos"
              placeholder="Upload Photos"
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const newFiles = Array.from(e.target.files);
                  field.onChange([...field.value, ...newFiles]);
                }
              }}
            />
            {field.value.map((file: File, index: number) => (
              <HStack key={index}>
                <Text>{file.name}</Text>
                <ButtonComponent
                  textOnly
                  onClick={() => {
                    const newFiles = field.value.filter(
                      (_: File, i: number) => i !== index,
                    );
                    field.onChange(newFiles);
                  }}
                >
                  Remove
                </ButtonComponent>
              </HStack>
            ))}
          </>
        )}
      />
      {errors.photos && (
        <Text fontSize="xs" color="red">
          At least one file must be uploaded
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
