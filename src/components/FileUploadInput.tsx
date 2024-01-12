import { HStack, Text } from "@chakra-ui/react";
import React from "react";
import { type Control, Controller, type FieldValues } from "react-hook-form";
import InputComponent from "~/components/InputComponent";
import ButtonComponent from "~/components/ButtonComponent";
import supabase from "~/utils/supabaseClient";

interface FileUploadProps {
  control: Control<FieldValues>;
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  multiple?: boolean;
  docs?: boolean;
  startLoading?: () => void;
  stopLoading?: () => void;
  driverId?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  control,
  name,
  label,
  placeholder,
  required = false,
  multiple = false,
  docs = false,
  startLoading,
  stopLoading,
  driverId,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      render={({ field: { onChange, value } }) => (
        <>
          <InputComponent
            label={label}
            name={name}
            placeholder={placeholder}
            type="file"
            docs={docs}
            multiple={multiple}
            onChange={(e) => {
              if (multiple) {
                const newFiles = e.target.files
                  ? Array.from(e.target.files)
                  : [];
                onChange([...((value as File[]) || []), ...newFiles]);
              } else {
                const file: File | null | undefined =
                  e.target.files && e.target.files.length > 0
                    ? e.target.files[0]
                    : null;
                onChange(file);
              }
            }}
          />
          {multiple ? (
            (value as File[]).map((file: File, index: number) => (
              <HStack key={index}>
                <Text>{typeof file === "string" ? file : file.name}</Text>
                <ButtonComponent
                  textOnly
                  onClick={async () => {
                    startLoading && startLoading();
                    const newFiles = (value as File[]).filter(
                      (_: File, i: number) => i !== index,
                    );
                    onChange(newFiles);

                    await supabase.storage
                      .from("photos")
                      .remove(
                        typeof file === "string"
                          ? [file]
                          : [`${driverId}/${file.name}`],
                      );

                    stopLoading && stopLoading();
                  }}
                >
                  Remove
                </ButtonComponent>
              </HStack>
            ))
          ) : (
            <Text>
              {typeof value === "string" ? value : (value as File)?.name}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default FileUpload;
