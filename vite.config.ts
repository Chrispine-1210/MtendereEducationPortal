import { VitePluginNodeConfig } from './node_modules/vite-plugin-node/dist/index.d';
// vite.config.ts (root)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import dns from 'node:dns';
import { VitePluginNode } from 'vite-plugin-node';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  plugins: [
    react(),
    VitePluginNode ({
      adapter: "express",
      appPath: "./server/index.ts",
      exportName: "app",
      tsCompiler: "esbuild",
    }),
  ],
  root: path.resolve(__dirname, 'client'),
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, './client/src'),
      '@server': path.resolve(__dirname, './server'),
      '@shared': path.resolve(__dirname, './shared/schema.ts')
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
  ssr: {
    noExternal: []
  }
});

