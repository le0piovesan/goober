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
  startLoading,
  stopLoading,
  driverId,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<
    File | null | undefined
  >(null);

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
            multiple={multiple}
            onChange={(e) => {
              if (multiple) {
                onChange(e.target.files ? Array.from(e.target.files) : null);
              } else {
                const file: File | null | undefined =
                  e.target.files && e.target.files.length > 0
                    ? e.target.files[0]
                    : null;
                setSelectedFile(file);
                onChange(file);
              }
            }}
          />
          {selectedFile && (
            <HStack>
              <Text>{selectedFile.name}</Text>
              <ButtonComponent
                textOnly
                onClick={async () => {
                  setSelectedFile(null);
                  onChange(null);
                  if (driverId && selectedFile) {
                    startLoading && startLoading();
                    await supabase.storage
                      .from("photos")
                      .remove([`${driverId}/${selectedFile.name}`]);
                    stopLoading && stopLoading();
                  }
                }}
              >
                Remove
              </ButtonComponent>
            </HStack>
          )}
          {multiple &&
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
                      .remove([`${driverId}/${file.name}`]);

                    stopLoading && stopLoading();
                  }}
                >
                  Remove
                </ButtonComponent>
              </HStack>
            ))}
        </>
      )}
    />
  );
};

export default FileUpload;
