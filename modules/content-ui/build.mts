import { resolve } from "path";
import { build, type InlineConfig } from "vite";
import { build as buildTW } from "tailwindcss/lib/cli/build";
import react from "@vitejs/plugin-react";

const __dirname = import.meta.dirname || resolve();
const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, "src");
const isDev = process.argv.includes("--dev");

const config: InlineConfig = {
  configFile: false,
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": isDev ? '"development"' : '"production"',
  },
  resolve: {
    alias: {
      "@src": srcDir,
      "@triad/shared": resolve(rootDir, "../../packages/shared"),
      "@triad/ui": resolve(rootDir, "../../packages/ui"),
    },
  },
  build: {
    lib: {
      name: "ContentUI",
      formats: ["iife"],
      entry: resolve(srcDir, "index.tsx"),
      fileName: "index",
    },
    outDir: resolve(rootDir, "../../dist/content-ui"),
    emptyOutDir: false,
    minify: !isDev,
    sourcemap: isDev,
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
};

async function buildContentUI() {
  try {
    const cssArgs = {
      "--input": resolve(srcDir, "style.css"),
      "--output": resolve(rootDir, "dist/index.css"),
      "--config": resolve(rootDir, "tailwind.config.ts"),
      ...(isDev && { "--watch": true }),
    };

    await buildTW(cssArgs);

    await build(config);
  } catch (error) {
    console.error("❌ Failed to build Content UI:", error);
    process.exit(1);
  }
}

buildContentUI();
