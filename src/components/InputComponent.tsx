import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  type UseFormRegister,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";

type InputComponentProps<TFormValues extends FieldValues> = {
  label: string;
  register: UseFormRegister<TFormValues>;
  name: keyof TFormValues;
  placeholder: string;
  type?: string;
  error?: FieldError;
};

const InputComponent = <TFormValues extends FieldValues>({
  label,
  register,
  name,
  placeholder,
  type = "text",
  error,
}: InputComponentProps<TFormValues>) => (
  <FormControl isInvalid={!!error}>
    <FormLabel>{label}</FormLabel>
    <Input
      {...register(name as string as Path<TFormValues>)}
      placeholder={placeholder}
      type={type}
    />
    <FormErrorMessage>{error?.message}</FormErrorMessage>
  </FormControl>
);

export default InputComponent;
