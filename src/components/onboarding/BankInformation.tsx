import { Text } from "@chakra-ui/react";
import React from "react";
import InputComponent from "~/components/InputComponent";
import type { OnboardingStepProps } from "~/types/onboarding";
import RadioComponent from "~/components/RadioComponent";

const BankInformation: React.FC<OnboardingStepProps> = ({
  register,
  errors,
  control,
  review,
}) => {
  return (
    <>
      {!review && (
        <Text textAlign={"center"}>
          In order to receive payments, a bank account must be provided.
        </Text>
      )}

      <InputComponent
        label="Account Number"
        name="accountNumber"
        placeholder="Account Number"
        mask="999999999999"
        register={register}
        error={errors.accountNumber}
      />

      <InputComponent
        label="Routing Number"
        name="routingNumber"
        placeholder="Routing Number"
        mask="999999999"
        register={register}
        error={errors.routingNumber}
      />

      <InputComponent
        label="Check Number"
        name="checkNumber"
        placeholder="Check Number"
        mask="9999"
        register={register}
        error={errors.checkNumber}
      />

      <RadioComponent
        label="Bank Name"
        control={control}
        name="bankName"
        select
        defaultValue="JPMorgan Chase"
        options={[
          { value: "JPMorgan Chase", label: "JPMorgan Chase" },
          { value: "Bank of America", label: "Bank of America" },
          { value: "Wells Fargo", label: "Wells Fargo" },
          { value: "Citigroup", label: "Citigroup" },
          { value: "Goldman Sachs", label: "Goldman Sachs" },
        ]}
      />
    </>
  );
};

export default BankInformation;
