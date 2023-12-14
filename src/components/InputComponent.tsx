import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import {
  type UseFormRegister,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useState } from "react";

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
}: InputComponentProps<TFormValues>) => {
  const [show, setShow] = useState<boolean>(false);
  const handleShowPassword = () => setShow(!show);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel color={"primary"} className="drop-shadow">
        {label}
      </FormLabel>
      <InputGroup size="md">
        <Input
          {...register(name as string as Path<TFormValues>)}
          placeholder={placeholder}
          type={type === "password" && show ? "text" : type}
          ringColor={error ? "red.500" : "border"}
          borderColor={"#dfe3ef"}
          bgColor={"#dfe3ef"}
          _hover={{
            borderColor: "secondary",
          }}
          focusBorderColor="secondary"
        />
        {type === "password" && (
          <InputRightElement width="4.5rem">
            <Button
              color={"gray"}
              h="1.75rem"
              size="sm"
              onClick={handleShowPassword}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>

      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default InputComponent;
