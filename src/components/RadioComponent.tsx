import {
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  Text,
  Select,
  Checkbox,
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
  defaultValue?: string;
  options: { value: string; label: string }[];
  select?: boolean;
  checkbox?: boolean;
  placeholder?: string;
};

const RadioComponent = <TFormValues extends FieldValues>({
  label,
  control,
  name,
  defaultValue,
  options,
  select,
  checkbox,
  placeholder,
}: RadioComponentProps<TFormValues>) => (
  <FormControl as="fieldset">
    <FormLabel as="legend" color="primary" className="drop-shadow">
      {label}
    </FormLabel>
    <Controller
      control={control}
      name={name as string as Path<TFormValues>}
      defaultValue={defaultValue as PathValue<TFormValues, Path<TFormValues>>}
      render={({ field }) =>
        select ? (
          <Select
            {...field}
            placeholder={placeholder}
            borderColor={"primary"}
            bgColor={"#dfe3ef"}
            _hover={{
              borderColor: "secondary",
            }}
            focusBorderColor="secondary"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : checkbox ? (
          <Stack display={"inline-block"}>
            {options.map((option) => (
              <Checkbox
                key={option.value}
                {...field}
                isChecked={(field.value as string[]).includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    field.onChange([...field.value, option.value]);
                  } else {
                    field.onChange(
                      (field.value as string[]).filter(
                        (value) => value !== option.value,
                      ),
                    );
                  }
                }}
                value={option.value}
                _checked={{
                  "& .chakra-checkbox__control": { background: "secondary" },
                }}
                backgroundColor={"background"}
                borderRadius={"md"}
                color={"light"}
                p={2}
                m={1}
                _hover={{
                  backgroundColor: "primary",
                }}
                size={"md"}
              >
                {option.label}
              </Checkbox>
            ))}
          </Stack>
        ) : (
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
        )
      }
    />
  </FormControl>
);

export default RadioComponent;
