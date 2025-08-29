import baseConfig from '@triad/tailwindcss-config';
import type { Config } from 'tailwindcss';

export default {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
} satisfies Config;