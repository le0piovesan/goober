import { VStack, useToast, Heading } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { type AuthContextType } from "~/context/type";
import ButtonComponent from "~/components/ButtonComponent";
import InputComponent from "~/components/InputComponent";
import { useLoading } from "~/hooks/useLoading";
import ContainerForm from "~/components/ContainerForm";
import { type z } from "zod";
import { schema } from "~/utils/schemas/login";

type FormInputsProps = z.infer<typeof schema>;

const Login: NextPage = () => {
  const { login }: AuthContextType = useAuth();
  const auth = api.auth.login.useMutation();
  const toast = useToast();
  const { loading, startLoading, stopLoading } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputsProps> = async (data) => {
    startLoading();
    try {
      const { email, password } = data;
      const response = await auth.mutateAsync({ email, password });
      await login({
        id: response.id,
        name: response.name,
        type: response.type,
        image: response.image,
        email,
        profileCompleted: response.profileCompleted,
        isLoggedIn: true,
      });
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
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) =>
          event.key === "Enter" && event.preventDefault()
        }
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
        w="full"
        maxW="md"
      >
        <Heading color={"primary"}>Login</Heading>
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

        <ButtonComponent type="submit" loading={loading}>
          Login
        </ButtonComponent>
        <ButtonComponent href="/" textOnly>
          Go Back
        </ButtonComponent>
      </VStack>
    </ContainerForm>
  );
};

export default Login;
