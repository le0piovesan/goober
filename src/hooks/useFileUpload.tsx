import supabase from "~/utils/supabaseClient";
import { useToast } from "@chakra-ui/react";

export const useFileUpload = () => {
  const toast = useToast();

  const fileUpload = async (
    id: number,
    files: File | File[],
    folderName: string,
  ) => {
    try {
      const fileList = Array.isArray(files) ? files : [files];
      const paths = [];

      for (const file of fileList) {
        const { data: existingFiles } = await supabase.storage
          .from(folderName)
          .list(`${id}/`);

        const fullPathFiles = existingFiles?.map(
          (file) => `${id}/${file.name}`,
        );

        const fileExists =
          typeof file === "string"
            ? fullPathFiles?.some((file: string) => file === file)
            : existingFiles?.some(({ name }) => name === file.name);

        if (!fileExists) {
          const { data, error: uploadError } = await supabase.storage
            .from(folderName)
            .upload(`${id}/${file.name}`, file);

          if (uploadError) {
            toast({
              title: "Error",
              description: uploadError.message,
              status: "error",
              duration: 4000,
              isClosable: true,
            });
            throw uploadError;
          }

          paths.push(data.path);
        } else
          paths.push(typeof file === "string" ? file : `${id}/${file.name}`);
      }

      return paths;
    } catch (error) {
      throw new Error("File upload failed");
    }
  };
  return { fileUpload };
};
