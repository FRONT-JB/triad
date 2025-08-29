import { withUI } from "@triad/ui";

export default withUI({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      zIndex: {
        extension: "2147483647",
        "extension-1": "2147483646",
        "extension-2": "2147483645",
      },
    },
  },
});
