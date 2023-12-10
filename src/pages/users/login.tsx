import { Box, VStack, useToast } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { type AuthContextType } from "~/context/type";
import ButtonComponent from "~/components/ButtonComponent";
import InputComponent from "~/components/InputComponent";
import { useLoading } from "~/hooks/useLoading";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

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
      await login({ id: response.id, name: response.name, isLoggedIn: true });
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
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
        w="full"
        maxW="md"
      >
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
    </Box>
  );
};

export default Login;
