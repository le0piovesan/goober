import { VStack, Text, Heading, HStack } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputComponent from "~/components/InputComponent";
import ContainerForm from "~/components/ContainerForm";
import ButtonComponent from "~/components/ButtonComponent";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import DateInput from "~/components/DateInput";
import RadioComponent from "~/components/RadioComponent";

type FormOnboardingData = {
  fullName: string;
  SSN: string;
  dateOfBirth: Date;
  gender: string;
};

const schema = z.object({
  fullName: z.string().min(1),
  SSN: z.string().length(11),
  dateOfBirth: z.date(),
  gender: z.enum([
    "Male",
    "Female",
    "Other",
    "Non-Binary",
    "Prefer not to say",
  ]),
});

type FormInputsProps = z.infer<typeof schema>;

const Onboarding: NextPage = () => {
  const [step, setStep] = useState(1);

  const nextStep = async () => {
    const result = await trigger(["fullName", "SSN", "dateOfBirth", "gender"]);
    const values = getValues();
    console.log(values.SSN.length);
    if (result) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    getValues,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      SSN: "",
      dateOfBirth: undefined,
      gender: undefined,
    },
  });

  return (
    <ContainerForm>
      <VStack as="form" spacing={4} w="full" maxW="md">
        <Text fontSize="xl" fontWeight="bold" color={"secondary"} m={1}>
          Welcome {user?.name}!
        </Text>
        <Heading color={"primary"}>Onboarding</Heading>
        <VStack mb={4}>
          {step === 1 && (
            <>
              <Text textAlign={"center"}>
                Before you become eligible to receive ride requests, we need
                some additional information to ensure that we provide the best
                service for all our users.
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
          )}
        </VStack>

        <HStack>
          <ButtonComponent
            onClick={prevStep}
            textOnly
            color="secondary"
            style={{
              pointerEvents: step === 1 ? "none" : "auto",
              opacity: step === 1 ? 0.4 : 1,
            }}
          >
            <FiArrowLeftCircle size={40} />
          </ButtonComponent>

          <Text>{step}/5</Text>

          {step === 5 ? (
            <ButtonComponent type="submit">Finish Profile</ButtonComponent>
          ) : (
            <ButtonComponent onClick={nextStep} textOnly>
              <FiArrowRightCircle size={60} />
            </ButtonComponent>
          )}
        </HStack>
      </VStack>
    </ContainerForm>
  );
};

export default Onboarding;
