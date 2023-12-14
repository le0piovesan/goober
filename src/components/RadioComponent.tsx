import {
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  Text,
} from "@chakra-ui/react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

type RadioComponentProps<TFormValues extends FieldValues> = {
  label: string;
  control: Control<TFormValues>;
  name: keyof TFormValues;
  defaultValue: string;
  options: { value: string; label: string }[];
};

const RadioComponent = <TFormValues extends FieldValues>({
  label,
  control,
  name,
  defaultValue,
  options,
}: RadioComponentProps<TFormValues>) => (
  <FormControl as="fieldset">
    <FormLabel as="legend" color="primary" className="drop-shadow">
      {label}
    </FormLabel>
    <Controller
      control={control}
      name={name as string as Path<TFormValues>}
      defaultValue={defaultValue as PathValue<TFormValues, Path<TFormValues>>}
      render={({ field }) => (
        <RadioGroup {...field}>
          <Stack direction="row" spacing={4}>
            {options.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                size={"md"}
                color={"primary"}
                _checked={{
                  bg: "primary",
                }}
                _hover={{
                  borderColor: "secondary",
                }}
              >
                <Text color="gray.600">{option.label}</Text>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      )}
    />
  </FormControl>
);

export default RadioComponent;
