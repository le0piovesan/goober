import {
  VStack,
  Text,
  Heading,
  HStack,
  useToast,
  SlideFade,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "~/utils/schemas/onboarding";
import ContainerForm from "~/components/ContainerForm";
import ButtonComponent from "~/components/ButtonComponent";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";
import { useAuth } from "~/context/AuthContext";
import DriverPersonalInfo from "~/components/onboarding/DriverPersonalInfo";
import VehicleInformation from "~/components/onboarding/VehicleInformation";
import Documents from "~/components/onboarding/Documents";
import DrivingHistory from "~/components/onboarding/DrivingHistory";
import BankInformation from "~/components/onboarding/BankInformation";
import ReviewAndSubmit from "~/components/onboarding/ReviewAndSubmit";
import { useLoading } from "~/hooks/useLoading";
import { useFileUpload } from "~/hooks/useFileUpload";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { type FormOnboardingData } from "~/types/onboarding";
import useOnboardingState from "~/hooks/useOnboardingState";
import OnboardingSkeleton from "~/components/onboarding/OnboardingSkeleton";
import { useEffect } from "react";
import _ from "lodash";

type FieldNames = keyof FormOnboardingData;
type StepFunction = (
  data: FormOnboardingData,
  driverId: number,
) => Promise<void>;

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
  const { user } = useAuth();
  const {
    onboardingState,
    defaultOnboardingData,
    step,
    setStep,
    isFetching,
    refetch,
  } = useOnboardingState();
  const toast = useToast();
  const { loading, startLoading, stopLoading } = useLoading();
  const { fileUpload } = useFileUpload();

  const updatePersonalInfo = api.onboarding.updatePersonalInfo.useMutation();
  const updateVehicleInfo = api.onboarding.updateVehicleInfo.useMutation();
  const updateDocuments = api.onboarding.updateDocuments.useMutation();
  const updateExperience = api.onboarding.updateExperience.useMutation();
  const updateBankInfo = api.onboarding.updateBankInfo.useMutation();
  const completeDriverProfile =
    api.onboarding.completeDriverProfile.useMutation();
  const router = useRouter();

  const {
    register,
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormOnboardingData>({
    resolver: zodResolver(schema),
    defaultValues: onboardingState ?? defaultOnboardingData,
  });

  useEffect(() => {
    if (onboardingState) {
      Object.keys(onboardingState).forEach((field) => {
        const fieldName = field as keyof FormOnboardingData;
        setValue(fieldName, onboardingState[fieldName]);
      });
    }
  }, [onboardingState, setValue]);

  const updatePersonalInfoData = async (
    data: FormOnboardingData,
    driverId: number,
  ) => {
    await updatePersonalInfo.mutateAsync({
      id: driverId,
      fullName: data.fullName!,
      SSN: data.SSN!,
      dateOfBirth: data.dateOfBirth!,
      gender: data.gender!,
    });
    refetch();
  };

  const updateVehicleInfoData = async (
    data: FormOnboardingData,
    driverId: number,
  ) => {
    const photosPaths = await fileUpload(driverId, data.photos!, "photos");

    await updateVehicleInfo.mutateAsync({
      id: driverId,
      type: data.type!,
      licensePlate: data.licensePlate!,
      photosPaths,
      features: data.features!,
    });
    refetch();
  };

  const updateDocumentsInfoData = async (
    data: FormOnboardingData,
    driverId: number,
  ) => {
    const [licensePath] = await fileUpload(
      driverId,
      [data.license!],
      "license",
    );
    const [insurancePath] = await fileUpload(
      driverId,
      [data.insurance!],
      "insurance",
    );
    const backgroundCheckDocumentsPaths = await fileUpload(
      driverId,
      data.backgroundCheckDocuments!,
      "backgroundCheckDocuments",
    );
    let professionalCertificatePath;
    if (data.professionalCertificate)
      [professionalCertificatePath] = await fileUpload(
        driverId,
        [data.professionalCertificate],
        "professionalCertificate",
      );

    if (!licensePath || !insurancePath)
      throw new Error("License and Insurance are required");

    await updateDocuments.mutateAsync({
      id: driverId,
      licensePath,
      insurancePath,
      backgroundCheckDocumentsPaths,
      professionalCertificatePath,
    });
    refetch();
  };

  const updateExperienceInfoData = async (
    data: FormOnboardingData,
    driverId: number,
  ) => {
    const referenceLettersPaths = await fileUpload(
      driverId,
      data.referenceLetters!,
      "referenceLetters",
    );
    await updateExperience.mutateAsync({
      id: driverId,
      experience: data.experience!,
      referenceLettersPaths,
    });
    refetch();
  };

  const updateBankInfoData = async (
    data: FormOnboardingData,
    driverId: number,
  ) => {
    await updateBankInfo.mutateAsync({
      id: driverId,
      accountNumber: data.accountNumber!,
      routingNumber: data.routingNumber!,
      checkNumber: data.checkNumber!,
      bankName: data.bankName!,
    });
    refetch();
  };

  const reviewAndSubmitInfoData = async (
    data: FormOnboardingData,
    driverId: number,
  ) => {
    await updatePersonalInfoData(data, driverId);
    await updateVehicleInfoData(data, driverId);
    await updateDocumentsInfoData(data, driverId);
    await updateExperienceInfoData(data, driverId);
    await updateBankInfoData(data, driverId);
    await completeDriverProfile.mutateAsync({ id: driverId });

    toast({
      title: "Onboarding Completed! 🎉",
      description: "You can now log in.",
      status: "success",
      position: "top",
      duration: 4000,
      isClosable: true,
    });
    await router.replace("/users/login");
  };

  const stepFunctions: Record<number, StepFunction> = {
    1: updatePersonalInfoData,
    2: updateVehicleInfoData,
    3: updateDocumentsInfoData,
    4: updateExperienceInfoData,
    5: updateBankInfoData,
    6: reviewAndSubmitInfoData,
  };

  const nextStep = async () => {
    const fieldsForCurrentStep =
      step === 6 ? fieldsPerStep.flat() : fieldsPerStep[step - 1] ?? [];
    const result = await trigger(fieldsForCurrentStep);

    const updateFunction = stepFunctions[step];
    if (result && updateFunction && user) {
      try {
        startLoading();
        const data = getValues();
        const dataForCurrentStep = _.pick(data, fieldsForCurrentStep);
        const stateForCurrentStep = _.pick(
          onboardingState,
          fieldsForCurrentStep,
        );
        const dataHasChanged = !_.isEqual(
          dataForCurrentStep,
          stateForCurrentStep,
        );
        if (
          dataHasChanged &&
          JSON.stringify(data) !== JSON.stringify(onboardingState)
        )
          await updateFunction(data, user.id);
        setStep(step + 1);
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
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (isFetching) return <OnboardingSkeleton />;

  return (
    <ContainerForm>
      <VStack spacing={4} w="full" maxW="md">
        <Text fontSize="xl" fontWeight="bold" color={"secondary"} m={1}>
          Welcome {user?.name}!
        </Text>
        <Heading color={"primary"}>Onboarding</Heading>
        <VStack mb={4}>
          {step === 1 && (
            <SlideFade in offsetX="80px">
              <DriverPersonalInfo
                register={register}
                errors={errors}
                control={control}
              />
            </SlideFade>
          )}
          {step === 2 && (
            <SlideFade in offsetX="80px">
              <VehicleInformation
                register={register}
                errors={errors}
                control={control}
                driverId={user?.id ?? 0}
                startLoading={startLoading}
                stopLoading={stopLoading}
              />
            </SlideFade>
          )}
          {step === 3 && (
            <SlideFade in offsetX="80px">
              <Documents
                register={register}
                errors={errors}
                control={control}
                driverId={user?.id ?? 0}
                startLoading={startLoading}
                stopLoading={stopLoading}
              />
            </SlideFade>
          )}
          {step === 4 && (
            <SlideFade in offsetX="80px">
              <DrivingHistory
                register={register}
                errors={errors}
                control={control}
                driverId={user?.id ?? 0}
                startLoading={startLoading}
                stopLoading={stopLoading}
              />
            </SlideFade>
          )}
          {step === 5 && (
            <SlideFade in offsetX="80px">
              <BankInformation
                register={register}
                errors={errors}
                control={control}
              />
            </SlideFade>
          )}
          {step === 6 && (
            <ReviewAndSubmit
              register={register}
              errors={errors}
              control={control}
              driverId={user?.id ?? 0}
              startLoading={startLoading}
              stopLoading={stopLoading}
            />
          )}
        </VStack>

        {step === 6 ? (
          <ButtonComponent onClick={nextStep} loading={loading}>
            Finish Profile
          </ButtonComponent>
        ) : (
          <HStack>
            <ButtonComponent
              onClick={prevStep}
              loading={loading}
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

            <ButtonComponent onClick={nextStep} loading={loading} textOnly>
              <FiArrowRightCircle size={60} />
            </ButtonComponent>
          </HStack>
        )}
      </VStack>
    </ContainerForm>
  );
};

export default Onboarding;
