import { build } from "vite";
import { resolve } from "path";
import { glob } from "glob";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.argv.includes("--dev");
const rootDir = resolve(__dirname);

async function buildContentUI() {
  console.log("🚀 Building content-ui modules...");

  // Find all match directories
  const matchPaths = await glob("src/matches/*/", { cwd: rootDir });

  if (matchPaths.length === 0) {
    console.warn("⚠️  No match directories found in src/matches/");
    return;
  }

  const buildPromises = matchPaths.map(async (matchPath) => {
    const matchName = matchPath.split("/")[2]; // Extract folder name
    const entryPath = resolve(rootDir, matchPath, "index.tsx");

    console.log(`📦 Building ${matchName}...`);

    try {
      await build({
        configFile: false,
        plugins: [react()],
        define: {
          "process.env.NODE_ENV": isDev ? '"development"' : '"production"',
        },
        build: {
          outDir: resolve(rootDir, "../../dist/content-ui"),
          lib: {
            entry: entryPath,
            name: `ContentUI_${matchName}`,
            formats: ["iife"],
            fileName: "index",
          },
          rollupOptions: {
            external: [],
            output: {
              globals: {},
            },
          },
          emptyOutDir: false,
          minify: !isDev,
          sourcemap: isDev,
        },
        resolve: {
          alias: {
            "@": resolve(rootDir, "src"),
            "@triad/shared": resolve(rootDir, "../../packages/shared"),
            "@triad/ui": resolve(rootDir, "../../packages/ui"),
          },
        },
        css: {
          postcss: {
            plugins: [
              (
                await import("tailwindcss")
              ).default({
                content: [
                  entryPath,
                  resolve(rootDir, matchPath, "**/*.{js,ts,jsx,tsx}"),
                  resolve(rootDir, "../../packages/ui/**/*.{js,ts,jsx,tsx}"),
                ],
                theme: {
                  extend: {
                    colors: {
                      "triad-primary": "#007acc",
                      "triad-secondary": "#ff6b35",
                      "triad-success": "#00c851",
                    },
                    zIndex: {
                      extension: "2147483647",
                      "extension-1": "2147483646",
                      "extension-2": "2147483645",
                    },
                  },
                },
                corePlugins: {
                  preflight: false,
                },
              }),
              (await import("autoprefixer")).default,
            ],
          },
        },
      });

      console.log(`✅ ${matchName} built successfully`);
    } catch (error) {
      console.error(`❌ Failed to build ${matchName}:`, error);
    }
  });

  await Promise.all(buildPromises);
  console.log("🎉 All content-ui modules built!");
}

buildContentUI().catch(console.error);
