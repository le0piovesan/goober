import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  InputRightElement,
  InputGroup,
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";
import {
  type UseFormRegister,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useState } from "react";

type InputComponentProps<TFormValues extends FieldValues> = {
  label?: string;
  register?: UseFormRegister<TFormValues>;
  name?: keyof TFormValues;
  placeholder: string;
  type?: string;
  error?: FieldError;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  mb?: number;
};

const InputComponent = <TFormValues extends FieldValues>({
  label,
  register,
  name,
  placeholder,
  type = "text",
  error,
  value,
  onChange,
  mb,
}: InputComponentProps<TFormValues>) => {
  const [show, setShow] = useState<boolean>(false);
  const handleShowPassword = () => setShow(!show);

  return (
    <FormControl isInvalid={!!error} mb={mb}>
      {label && (
        <FormLabel color={"primary"} className="drop-shadow">
          {label}
        </FormLabel>
      )}
      <InputGroup size="md">
        {type === "file" ? (
          <HStack>
            <Box
              as="label"
              htmlFor={name as string}
              cursor="pointer"
              p={2}
              color="blue.500"
              border="1px solid"
              borderColor="blue.500"
              borderRadius="md"
            >
              Choose File
              <Input
                id={name as string}
                type="file"
                display="none"
                onChange={onChange}
              />
            </Box>
            <Text fontSize={"xs"}>
              We demand an image due to security reasons{" "}
            </Text>
          </HStack>
        ) : (
          <>
            <Input
              {...(register && name
                ? register(name as string as Path<TFormValues>)
                : {})}
              placeholder={placeholder}
              type={type === "password" && show ? "text" : type}
              ringColor={error ? "red.500" : "border"}
              borderColor={"primary"}
              bgColor={"#dfe3ef"}
              _hover={{
                borderColor: "secondary",
              }}
              focusBorderColor="secondary"
              value={value}
              onChange={onChange}
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
          </>
        )}
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default InputComponent;
