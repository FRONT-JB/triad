import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export const createViteConfig = (options: {
  entry?: string;
  outDir?: string;
  name?: string;
  format?: 'es' | 'cjs' | 'umd' | 'iife';
  plugins?: any[];
} = {}): UserConfig => {
  const {
    entry = 'index.ts',
    outDir = 'dist',
    name = 'App',
    format = 'iife',
    plugins = []
  } = options;

  return defineConfig({
    plugins: [react(), ...plugins],
    build: {
      outDir,
      lib: format !== 'es' ? {
        entry,
        name,
        formats: [format],
        fileName: 'index'
      } : undefined,
      rollupOptions: {
        external: format === 'es' ? ['react', 'react-dom'] : [],
        output: {
          globals: format !== 'es' ? {
            react: 'React',
            'react-dom': 'ReactDOM'
          } : undefined
        }
      },
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@': resolve(process.cwd(), 'src'),
        '@triad/shared': resolve(process.cwd(), '../../packages/shared'),
        '@triad/ui': resolve(process.cwd(), '../../packages/ui'),
      }
    }
  });
};