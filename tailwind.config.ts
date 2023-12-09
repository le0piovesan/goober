import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "#4ffbdf",
        secondary: "#845ec2",
        optional: "#2ac97a",
        background: "#8888dd",
        border: "#3f48cc",
      },
    },
  },
  plugins: [],
} satisfies Config;
