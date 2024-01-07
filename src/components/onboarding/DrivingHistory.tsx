import { HStack, Text } from "@chakra-ui/react";
import React from "react";
import { Controller } from "react-hook-form";
import InputComponent from "~/components/InputComponent";
import type { OnboardingStepProps } from "~/types/onboarding";
import ButtonComponent from "../ButtonComponent";

const DrivingHistory: React.FC<OnboardingStepProps> = ({
  register,
  errors,
  control,
  review,
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

      <Controller
        control={control}
        name="referenceLetters"
        render={({ field }) => (
          <>
            <InputComponent
              label="Reference Letters"
              name="referenceLetters"
              placeholder="Reference Letters"
              type="file"
              multiple
              docs
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
    </>
  );
};

export default DrivingHistory;
