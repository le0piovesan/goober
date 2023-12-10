import { type NextPage } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { useState } from "react";
import { useRouter } from "next/router";

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
  const rider = api.rider.createRider.useMutation();
  const driver = api.driver.createDriver.useMutation();

  const {
    register,
    handleSubmit,
    getValues,
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

      alert("Account created successfully!");
      await router.push("/users/login");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) setSubmitError(error.message);
      else setSubmitError("An unknown error occurred");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md space-y-4"
      >
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <input
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          type="password"
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}

        <label>
          <input
            {...register("role")}
            type="radio"
            value="Rider"
            defaultChecked
          />
          Rider
        </label>
        <label>
          <input {...register("role")} type="radio" value="Driver" />
          Driver
        </label>

        {submitError && <p className="text-red-500">{submitError}</p>}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUp;
