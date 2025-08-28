import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, "../../dist"),
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/pages/popup/index.html"),
        "side-panel": resolve(__dirname, "src/pages/side-panel/index.html"),
        content: resolve(__dirname, "src/pages/content/index.ts"),
        background: resolve(__dirname, "src/background/index.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".html")) {
            return "[name][extname]";
          }
          return "[name].[ext]";
        },
      },
    },
  },
});
