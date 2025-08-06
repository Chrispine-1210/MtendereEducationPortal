import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared/schema.ts')
    }
  },
  
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      scss: {
        importers: ['./postcss.config.cjs'],
        additionalData: '$injectedColor: orange;',
      },
    }
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:3001`,
        changeOrigin: true,
        secure: false,
      },
      '/uploads':{
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    }
  },

  root: path.resolve(__dirname),
  build: {
    ssrManifest: true,
    outDir: path.resolve(__dirname, '../dist/public'),
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
    emptyOutDir: true,
  },
});
