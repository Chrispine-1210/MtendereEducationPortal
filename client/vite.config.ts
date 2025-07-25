import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared')
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
        target: `http://localhost:${process.env.BACKEND_PORT || 5000}`,
        changeOrigin: true,
        secure: false,
      },
    }
  },
  build: {
    outDir: '../dist/client',
    emptyOutDir: true
  }
});

