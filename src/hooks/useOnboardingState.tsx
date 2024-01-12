import { useAuth } from "~/context/AuthContext";
import { useMemo, useState } from "react";
import { type FormOnboardingData } from "~/types/onboarding";
import { client } from "~/utils/trpc";
import { useQuery } from "@tanstack/react-query";

interface useOnboardingStateReturn {
  onboardingState: FormOnboardingData | undefined | null;
  defaultOnboardingData: FormOnboardingData;
  isFetching: boolean;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => void;
}

const useOnboardingState = (): useOnboardingStateReturn => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const defaultOnboardingData = useMemo(
    () => ({
      currentOnboardingStep: 1,
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
    }),
    [],
  );

  const {
    data: onboardingData,
    isLoading,
    refetch,
  } = useQuery(
    ["getDriverOnboardingData", { id: user?.id ?? 0 }],
    () =>
      client.onboarding.getDriverOnboardingData.query({ id: user?.id ?? 0 }),
    {
      enabled: !!user,
      onSuccess: (data: FormOnboardingData) => {
        if (data.currentOnboardingStep) {
          setStep(data.currentOnboardingStep);
        }
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  );

  const result: useOnboardingStateReturn = useMemo(
    () => ({
      onboardingState: onboardingData,
      defaultOnboardingData,
      isFetching: isLoading,
      step,
      setStep,
      refetch,
    }),
    [onboardingData, defaultOnboardingData, step, setStep, refetch],
  );

  return result;
};

export default useOnboardingState;
