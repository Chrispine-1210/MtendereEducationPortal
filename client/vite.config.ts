import { defineConfig, createServer } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Server } from 'http';
import { styleText } from 'util';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  },

  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: 'import React from React',
  },
  
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl:  {
        define: {
          $specialColor: new styleText.nodes.RGBA(51, 197, 255, 1),
        },
      },
      scss:{
        importers: [
          './postcss.config.cjs'
        ],
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