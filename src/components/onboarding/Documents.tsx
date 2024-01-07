import { HStack, Text } from "@chakra-ui/react";
import React from "react";
import { Controller } from "react-hook-form";
import InputComponent from "~/components/InputComponent";
import type { OnboardingStepProps } from "~/types/onboarding";
import ButtonComponent from "../ButtonComponent";

const Documents: React.FC<OnboardingStepProps> = ({ errors, control }) => {
  return (
    <>
      <Text textAlign={"center"}>
        Necessary documents so we can provide the safest service.
      </Text>

      <Controller
        control={control}
        name="license"
        render={({ field }) => (
          <>
            <InputComponent
              label="Driver's License"
              name="license"
              placeholder="Driver's License"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  field.onChange(e.target.files[0]);
                }
              }}
            />
            {field.value && <Text>{field.value.name}</Text>}
          </>
        )}
      />
      {errors.license && (
        <Text fontSize="xs" color="red">
          The Driver's license must be uploaded
        </Text>
      )}

      <Controller
        control={control}
        name="insurance"
        render={({ field }) => (
          <>
            <InputComponent
              label="Vehicle Insurance"
              name="insurance"
              placeholder="Vehicle Insurance"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  field.onChange(e.target.files[0]);
                }
              }}
            />
            {field.value && <Text>{field.value.name}</Text>}
          </>
        )}
      />
      {errors.insurance && (
        <Text fontSize="xs" color="red">
          The Vehicle insurance must be uploaded
        </Text>
      )}

      <Controller
        control={control}
        name="backgroundCheckDocuments"
        rules={{ required: true }}
        render={({ field }) => (
          <>
            <InputComponent
              label="Background Check Documents"
              name="backgroundCheckDocuments"
              placeholder="Background Check Documents"
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
      {errors.backgroundCheckDocuments && (
        <Text fontSize="xs" color="red">
          At least one document must be uploaded
        </Text>
      )}

      <Controller
        control={control}
        name="professionalCertificate"
        render={({ field }) => (
          <>
            <InputComponent
              label="Professional Certificate for Luxury Drivers"
              name="professionalCertificate"
              placeholder="Professional Certificate"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  field.onChange(e.target.files[0]);
                }
              }}
            />
            {field.value && <Text>{field.value.name}</Text>}
          </>
        )}
      />
    </>
  );
};

export default Documents;
