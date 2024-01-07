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
        const { data, error } = await supabase.storage
          .from(folderName)
          .upload(`/${id}/${file.name}`, file);

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          throw error;
        }
        paths.push(data.path);
      }

      return paths;
    } catch (error) {
      throw new Error("File upload failed");
    }
  };

  return { fileUpload };
};
