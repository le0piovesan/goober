import { useToast, VStack, Text, Heading } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import InputComponent from "~/components/InputComponent";
import RadioComponent from "~/components/RadioComponent";
import { useLoading } from "~/hooks/useLoading";
import ContainerForm from "~/components/ContainerForm";
import ButtonComponent from "~/components/ButtonComponent";
import supabase from "~/utils/supabaseClient";
import { File } from "@web-std/file";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "Rider" | "Driver";
  type: "Regular" | "Luxury";
  image: File;
};

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
  type: z.enum(["Regular", "Luxury"]),
  image: z.instanceof(File).refine((file) => file !== null),
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
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Rider",
      type: "Regular",
      image: undefined,
    },
  });

  const role = watch("role");

  const uploadImage = async (email: string, image: File) => {
    const { data, error } = await supabase.storage
      .from("avatar")
      .upload(`/${email}`, image);

    if (error) {
      toast({
        title: "Error",
        description: `There is already an user with this email 😢`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      throw error;
    }
    return data.path;
  };

  const onSubmit: SubmitHandler<FormInputsProps> = async (data) => {
    if (getValues("confirmPassword") !== getValues("password")) {
      toast({
        title: "Error",
        description: "Passwords don't match 🔑",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      startLoading();
      const { name, email, password, role, type, image }: FormData = data;

      const path = await uploadImage(email, image);

      role === "Rider"
        ? await rider.mutateAsync({ name, email, password, image: path })
        : await driver.mutateAsync({
            name,
            email,
            password,
            type,
            image: path,
          });

      toast({
        title: "Account Created! 🎉",
        description: "You can now log in.",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
      await router.replace("/users/login");
    } catch (error) {
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
        <Heading color={"primary"}>Sign up</Heading>
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

        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <>
              <InputComponent
                label="Upload Image"
                name="image"
                placeholder="Upload Image"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    field.onChange(e.target.files[0]);
                  }
                }}
              />
              {field.value && <Text>{field.value.name}</Text>}
            </>
          )}
        />
        {errors.image && (
          <Text fontSize="xs" color="red">
            An avatar must be uploaded
          </Text>
        )}

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

        {role === "Driver" && (
          <RadioComponent
            label="Do you prefer to work with regular or luxury cars?"
            control={control}
            name="type"
            defaultValue="Regular"
            options={[
              { value: "Regular", label: "Regular" },
              { value: "Luxury", label: "Luxury" },
            ]}
          />
        )}

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
