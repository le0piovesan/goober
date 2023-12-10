import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { useState } from "react";
import ButtonComponent from "~/components/ButtonComponent";

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();
  const rider = api.rider.createRider.useMutation();
  const driver = api.driver.createDriver.useMutation();

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
      setSubmitError("Passwords don't match");
      return;
    }

    try {
      const { name, email, password, role } = data;
      role === "Rider"
        ? await rider.mutateAsync({ name, email, password })
        : await driver.mutateAsync({ name, email, password });

      toast({
        title: "Account created.",
        description: "We've created your account.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      await router.push("/users/login");
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
      bg="gray.100"
    >
      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
        w="full"
        maxW="md"
      >
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input {...register("name")} placeholder="Name" />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input {...register("email")} placeholder="Email" type="email" />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            {...register("password")}
            placeholder="Password"
            type="password"
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            type="password"
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl as="fieldset">
          <FormLabel as="legend">Role</FormLabel>
          <Controller
            control={control}
            name="role"
            defaultValue="Rider"
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack direction="row">
                  <Radio value="Rider">Rider</Radio>
                  <Radio value="Driver">Driver</Radio>
                </Stack>
              </RadioGroup>
            )}
          />
        </FormControl>

        {submitError && <FormErrorMessage>{submitError}</FormErrorMessage>}

        <ButtonComponent type="submit">Create Account</ButtonComponent>
        <ButtonComponent href="/" textOnly>
          Go Back
        </ButtonComponent>
      </VStack>
    </Box>
  );
};

export default SignUp;
