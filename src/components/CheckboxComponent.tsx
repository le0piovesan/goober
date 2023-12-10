import {
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

type CheckboxComponentProps<TFormValues extends FieldValues> = {
  label: string;
  control: Control<TFormValues>;
  name: keyof TFormValues;
  defaultValue: string;
  options: { value: string; label: string }[];
};

const CheckboxComponent = <TFormValues extends FieldValues>({
  label,
  control,
  name,
  defaultValue,
  options,
}: CheckboxComponentProps<TFormValues>) => (
  <FormControl as="fieldset">
    <FormLabel as="legend">{label}</FormLabel>
    <Controller
      control={control}
      name={name as string as Path<TFormValues>}
      defaultValue={defaultValue as PathValue<TFormValues, Path<TFormValues>>}
      render={({ field }) => (
        <RadioGroup {...field}>
          <Stack direction="row">
            {options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      )}
    />
  </FormControl>
);

export default CheckboxComponent;
