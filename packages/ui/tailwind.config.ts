import globalConfig from "@triad/tailwindcss-config";
import type { Config } from "tailwindcss";

export default {
  content: ["./lib/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [globalConfig],
} satisfies Config;
