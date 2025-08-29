import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    hmr: false
  },
  build: {
    outDir: '../../dist/side-panel',
    emptyOutDir: true
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(tailwindConfig),
        autoprefixer,
      ]
    }
  }
});