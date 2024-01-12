import { Text } from "@chakra-ui/react";
import React from "react";
import type { OnboardingStepProps } from "~/types/onboarding";
import FileUpload from "../FileUploadInput";

const Documents: React.FC<OnboardingStepProps> = ({
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
          Necessary documents so we can provide the safest service.
        </Text>
      )}

      <FileUpload
        control={control}
        name="license"
        label="Driver's License"
        placeholder="Driver's License"
        required={true}
        startLoading={startLoading}
        stopLoading={stopLoading}
        driverId={driverId}
      />
      {errors.license && (
        <Text fontSize="xs" color="red">
          The Driver's license must be uploaded
        </Text>
      )}

      <FileUpload
        control={control}
        name="insurance"
        label="Vehicle Insurance"
        placeholder="Vehicle Insurance"
        required={true}
        startLoading={startLoading}
        stopLoading={stopLoading}
        driverId={driverId}
      />
      {errors.insurance && (
        <Text fontSize="xs" color="red">
          The Vehicle insurance must be uploaded
        </Text>
      )}

      <FileUpload
        control={control}
        name="backgroundCheckDocuments"
        label="Background Check Documents"
        placeholder="Background Check Documents"
        required={true}
        multiple={true}
        startLoading={startLoading}
        stopLoading={stopLoading}
        driverId={driverId}
      />
      {errors.backgroundCheckDocuments && (
        <Text fontSize="xs" color="red">
          At least one document must be uploaded
        </Text>
      )}

      <FileUpload
        control={control}
        name="professionalCertificate"
        label="Professional Certificate for Luxury Drivers"
        placeholder="Professional Certificate"
        required={false}
        startLoading={startLoading}
        stopLoading={stopLoading}
        driverId={driverId}
      />
    </>
  );
};

export default Documents;
