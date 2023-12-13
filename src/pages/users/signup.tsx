import { useToast, VStack } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import ButtonComponent from "~/components/ButtonComponent";
import InputComponent from "~/components/InputComponent";
import RadioComponent from "~/components/RadioComponent";
import { useLoading } from "~/hooks/useLoading";
import ContainerForm from "~/components/ContainerForm";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["Rider", "Driver"]),
});

type FormInputsProps = z.infer<typeof schema>;

const SignUp: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const rider = api.rider.createRider.useMutation();
  const driver = api.driver.createDriver.useMutation();
  const { loading, startLoading, stopLoading } = useLoading();

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<FormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Rider",
    },
  });

  const onSubmit: SubmitHandler<FormInputsProps> = async (data) => {
    if (getValues("confirmPassword") !== getValues("password")) {
      toast({
        title: "Error",
        description: "Passwords don't match 🔑",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      startLoading();
      const { name, email, password, role } = data;
      role === "Rider"
        ? await rider.mutateAsync({ name, email, password })
        : await driver.mutateAsync({ name, email, password });

      toast({
        title: "Account Created! 🎉",
        description: "You can now log in.",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
      await router.push("/users/login");
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        toast({
          title: "Error",
          description: `${error.message} 😢`,
          status: "error",
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
        <InputComponent
          label="Name"
          register={register}
          name="name"
          placeholder="Name"
          error={errors.name}
        />
        <InputComponent
          label="Email"
          register={register}
          name="email"
          placeholder="Email"
          type="email"
          error={errors.email}
        />
        <InputComponent
          label="Password"
          register={register}
          name="password"
          placeholder="Password"
          type="password"
          error={errors.password}
        />
        <InputComponent
          label="Confirm Password"
          register={register}
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          error={errors.confirmPassword}
        />
        <RadioComponent
          label="Are you a?"
          control={control}
          name="role"
          defaultValue="Rider"
          options={[
            { value: "Rider", label: "Rider" },
            { value: "Driver", label: "Driver" },
          ]}
        />

        <ButtonComponent type="submit" loading={loading}>
          Create Account
        </ButtonComponent>
        <ButtonComponent href="/" textOnly>
          Go Back
        </ButtonComponent>
      </VStack>
    </ContainerForm>
  );
};

export default SignUp;
