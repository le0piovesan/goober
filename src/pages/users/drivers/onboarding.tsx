import { VStack, Text, Heading, HStack, useToast } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { File } from "@web-std/file";
import ContainerForm from "~/components/ContainerForm";
import ButtonComponent from "~/components/ButtonComponent";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import DriverPersonalInfo from "~/components/onboarding/DriverPersonalInfo";
import VehicleInformation from "~/components/onboarding/VehicleInformation";
import Documents from "~/components/onboarding/Documents";
import DrivingHistory from "~/components/onboarding/DrivingHistory";
import BankInformation from "~/components/onboarding/BankInformation";
import ReviewAndSubmit from "~/components/onboarding/ReviewAndSubmit";
import { useLoading } from "~/hooks/useLoading";
import { useFileUpload } from "~/hooks/useFileUpload";
import { type FormOnboardingData } from "~/types/onboarding";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

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
  type: z.enum(["Sedan", "SUV", "Truck", "Van"]),
  licensePlate: z.string().min(5).max(7),
  photos: z.array(z.instanceof(File)).refine((files) => files.length > 0),
  features: z.array(z.string()),
  license: z.instanceof(File).refine((file) => file !== null),
  insurance: z.instanceof(File).refine((file) => file !== null),
  backgroundCheckDocuments: z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0),
  professionalCertificate: z.instanceof(File).optional(),
  experience: z.string().min(1),
  referenceLetters: z.array(z.instanceof(File)),
  accountNumber: z.string().min(10).max(12),
  routingNumber: z.string().length(9),
  checkNumber: z.string().length(4),
  bankName: z.enum([
    "JPMorgan Chase",
    "Bank of America",
    "Wells Fargo",
    "Citigroup",
    "Goldman Sachs",
  ]),
});

type FormInputsProps = z.infer<typeof schema>;
type FieldNames = keyof FormInputsProps;

const fieldsPerStep: FieldNames[][] = [
  ["fullName", "SSN", "dateOfBirth", "gender"],
  ["type", "licensePlate", "photos", "features"],
  [
    "license",
    "insurance",
    "backgroundCheckDocuments",
    "professionalCertificate",
  ],
  ["experience", "referenceLetters"],
  ["accountNumber", "routingNumber", "checkNumber", "bankName"],
];

const Onboarding: NextPage = () => {
  const [step, setStep] = useState(1);
  const toast = useToast();
  const { user } = useAuth();
  const { loading, startLoading, stopLoading } = useLoading();
  const { fileUpload } = useFileUpload();
  const driver = api.driver.completeDriverProfile.useMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
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
      type: undefined,
      licensePlate: "",
      photos: [],
      features: [],
      license: undefined,
      insurance: undefined,
      backgroundCheckDocuments: [],
      professionalCertificate: undefined,
      experience: "",
      referenceLetters: [],
      accountNumber: "",
      routingNumber: "",
      checkNumber: "",
      bankName: undefined,
    },
  });

  const nextStep = async () => {
    const result = await trigger(fieldsPerStep[step - 1]);
    if (result) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit: SubmitHandler<FormInputsProps> = async (data, event) => {
    try {
      event?.preventDefault();
      startLoading();

      const {
        fullName,
        SSN,
        dateOfBirth,
        gender,
        type,
        licensePlate,
        photos,
        features,
        license,
        insurance,
        backgroundCheckDocuments,
        professionalCertificate,
        experience,
        referenceLetters,
        accountNumber,
        routingNumber,
        checkNumber,
        bankName,
      }: FormOnboardingData = data;

      if (user) {
        const photosPaths = await fileUpload(user.id, photos, "photos");
        const [licensePath] = await fileUpload(user.id, [license], "license");
        const [insurancePath] = await fileUpload(
          user.id,
          [insurance],
          "insurance",
        );
        const backgroundCheckDocumentsPaths = await fileUpload(
          user.id,
          backgroundCheckDocuments,
          "backgroundCheckDocuments",
        );
        let professionalCertificatePath;
        if (professionalCertificate)
          [professionalCertificatePath] = await fileUpload(
            user.id,
            [professionalCertificate],
            "professionalCertificate",
          );
        const referenceLettersPaths = await fileUpload(
          user.id,
          referenceLetters,
          "referenceLetters",
        );

        if (!licensePath || !insurancePath)
          throw new Error("License and Insurance are required");

        await driver.mutateAsync({
          id: user.id,
          fullName,
          SSN,
          dateOfBirth,
          gender,
          type,
          licensePlate,
          photosPaths,
          features,
          licensePath,
          insurancePath,
          backgroundCheckDocumentsPaths,
          professionalCertificatePath,
          experience,
          referenceLettersPaths,
          accountNumber,
          routingNumber,
          checkNumber,
          bankName,
        });

        toast({
          title: "Onboarding Completed! 🎉",
          description: "You can now log in.",
          status: "success",
          position: "top",
          duration: 4000,
          isClosable: true,
        });
        await router.replace("/users/login");
      }
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: `${error.message} 😢`,
          status: "error",
          position: "top",
          duration: 4000,
          isClosable: true,
        });
    } finally {
      stopLoading();
    }
  };

  return (
    <ContainerForm>
      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
        w="full"
        maxW="md"
      >
        <Text fontSize="xl" fontWeight="bold" color={"secondary"} m={1}>
          Welcome {user?.name}!
        </Text>
        <Heading color={"primary"}>Onboarding</Heading>
        <VStack mb={4}>
          {step === 1 && (
            <DriverPersonalInfo
              register={register}
              errors={errors}
              control={control}
            />
          )}
          {step === 2 && (
            <VehicleInformation
              register={register}
              errors={errors}
              control={control}
            />
          )}
          {step === 3 && (
            <Documents register={register} errors={errors} control={control} />
          )}
          {step === 4 && (
            <DrivingHistory
              register={register}
              errors={errors}
              control={control}
            />
          )}
          {step === 5 && (
            <BankInformation
              register={register}
              errors={errors}
              control={control}
            />
          )}
          {step === 6 && (
            <ReviewAndSubmit
              register={register}
              errors={errors}
              control={control}
            />
          )}
        </VStack>

        {step === 6 ? (
          <ButtonComponent type="submit" loading={loading}>
            Finish Profile
          </ButtonComponent>
        ) : (
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

            <ButtonComponent onClick={nextStep} textOnly>
              <FiArrowRightCircle size={60} />
            </ButtonComponent>
          </HStack>
        )}
      </VStack>
    </ContainerForm>
  );
};

export default Onboarding;
