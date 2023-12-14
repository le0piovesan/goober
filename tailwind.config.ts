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
        primary: "#845ec2",
        secondary: "#35c4ad",
        light: "#f9f9f9",
        dark: "#222222",
        optional: "#2ac97a",
        background: "#8888dd",
        border: "#3f48cc",
      },
      boxShadow: {
        "drop-shadow": "0 1.2px 1.2px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
} satisfies Config;
