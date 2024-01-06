import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
} from "@chakra-ui/react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type Control,
  Controller,
} from "react-hook-form";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type InputComponentProps<TFormValues extends FieldValues> = {
  label: string;
  control: Control<TFormValues>;
  name: keyof TFormValues;
  error?: FieldError;
};

const DateInput = <TFormValues extends FieldValues>({
  label,
  control,
  name,
  error,
}: InputComponentProps<TFormValues>) => {
  return (
    <FormControl isInvalid={!!error} my={2}>
      {label && (
        <FormLabel color={"primary"} className="drop-shadow">
          {label}
        </FormLabel>
      )}
      <InputGroup size="md">
        <Controller
          control={control}
          name={name as string as Path<TFormValues>}
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="MM/DD/YYYY"
              showMonthDropdown
              showYearDropdown
              yearDropdownItemNumber={80}
              maxDate={new Date()}
              scrollableYearDropdown
              className="w-full rounded-md border-[1.5px] border-primary bg-[#dfe3ef] p-2 text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          )}
        />
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default DateInput;
