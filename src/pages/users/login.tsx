import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  VStack,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { type AuthContextType } from "~/context/type";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

type FormInputsProps = z.infer<typeof schema>;

const Login: NextPage = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login }: AuthContextType = useAuth();
  const auth = api.auth.login.useMutation();

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
    try {
      const { email, password } = data;
      const response = await auth.mutateAsync({ email, password });
      await login({ id: response.id, name: response.name, isLoggedIn: true });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) setSubmitError(error.message);
      else setSubmitError("An unknown error occurred");
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
        <FormControl isInvalid={!!errors.email}>
          <Input {...register("email")} placeholder="Email" type="email" />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <Input
            {...register("password")}
            placeholder="Password"
            type="password"
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        {submitError && <FormErrorMessage>{submitError}</FormErrorMessage>}

        <Button type="submit" colorScheme="blue" w="full">
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
