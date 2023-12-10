import { type NextPage } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { useState } from "react";
import { useAuth } from "~/context/AuthContext";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

type FormInputsProps = z.infer<typeof schema>;

const Login: NextPage = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { login } = useAuth();
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md space-y-4"
      >
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

        {submitError && <p className="text-red-500">{submitError}</p>}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
