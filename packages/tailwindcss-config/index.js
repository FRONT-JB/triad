import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        triad: {
          primary: '#007acc',
          secondary: '#ff6b35',
          success: '#00c851',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      zIndex: {
        'extension': '2147483647',
        'extension-1': '2147483646',
        'extension-2': '2147483645',
      }
    },
  },
  plugins: [
    forms,
  ],
  corePlugins: {
    preflight: false, // Disable base styles to avoid conflicts with host page
  }
}