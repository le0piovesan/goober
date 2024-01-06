import { VStack, Text, Heading, Flex, HStack } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputComponent from "~/components/InputComponent";
import ContainerForm from "~/components/ContainerForm";
import ButtonComponent from "~/components/ButtonComponent";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";
import { useState } from "react";

type FormOnboardingData = {
  fullName: string;
  SSN: string;
  dateOfBirth: Date;
  gender: string;
};

const schema = z.object({
  fullName: z.string().min(1),
  SSN: z.string().min(9).max(9),
  dateOfBirth: z.date(),
  type: z.enum(["Male", "Female", "Other"]),
});

type FormInputsProps = z.infer<typeof schema>;

const Onboarding: NextPage = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <ContainerForm>
      <VStack as="form" spacing={4} w="full" maxW="md">
        <Text fontSize="xl" fontWeight="bold" color={"secondary"} m={1}>
          Welcome!
        </Text>
        <Heading color={"primary"}>Onboarding</Heading>
        <VStack mb={4}>
          {step === 1 && (
            <>
              <Text textAlign={"center"}>
                Before being eligible for receiving rides, we need some more
                information to make sure we provide the best service for all our
                users.
              </Text>

              <InputComponent
                label="Full Name"
                name="fullName"
                placeholder="Full Name"
              />
              <InputComponent
                label="Social Security Number (SSN)"
                name="SSN"
                placeholder="SSN"
              />
              <InputComponent
                label="Date of Birth"
                name="dateOfBirth"
                placeholder="Date of Birth"
              />
              <InputComponent
                label="Gender"
                name="gender"
                placeholder="Gender"
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
