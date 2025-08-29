import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import tailwindConfig from "./tailwind.config";
import { resolve } from "path";

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, "src");

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    hmr: false,
  },
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  publicDir: resolve(rootDir, "public"),
  build: {
    outDir: resolve(rootDir, "..", "..", "dist", "side-panel"),
  },
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig), autoprefixer],
    },
  },
});
