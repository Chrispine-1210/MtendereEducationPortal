// vite.config.ts (root)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import dns from 'node:dns';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'),
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, 'client/src'),
      '@server': path.resolve(__dirname, 'server'),
      '@shared': path.resolve(__dirname, 'shared/schema.ts')
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ['**/.*'],
    },
  },
});

