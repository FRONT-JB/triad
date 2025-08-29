declare module "tailwindcss/lib/cli/build";

declare module "*?inline" {
  const src: string;
  export default src;
}

declare module "@triad/tailwindcss-config" {
  import { Config } from "tailwindcss";
  const config: Config;
  export default config;
}
