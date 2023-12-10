import { extendTheme } from "@chakra-ui/react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config";

const { theme } = resolveConfig(tailwindConfig);

const extendedTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...tailwindConfig.theme.extend.colors,
  },
};

export default extendTheme(extendedTheme);
