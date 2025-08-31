import globalConfig from "@triad/tailwindcss-config";
import deepmerge from "deepmerge";
import type { Config } from "tailwindcss";

export const withUI = (tailwindConfig: Config): Config =>
  deepmerge(
    { ...globalConfig, ...tailwindConfig },
    {
      content: [
        "../../packages/ui/lib/**/*.tsx",
        "../../packages/ui/components/**/*.tsx",
      ],
    }
  );
