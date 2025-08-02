import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared/schema')
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
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.BACKEND_PORT || 3000}`,
        changeOrigin: true,
        secure: false,
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
