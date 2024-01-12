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
        const { data: existingFile } = await supabase.storage
          .from(folderName)
          .download(`${id}/${file.name}`);

        if (!existingFile) {
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
        } else {
          paths.push(`${id}/${file.name}`);
        }
      }

      return paths;
    } catch (error) {
      throw new Error("File upload failed");
    }
  };
  return { fileUpload };
};
