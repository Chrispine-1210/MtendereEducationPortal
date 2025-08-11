import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import baseConfig from '../vite.base.config';

export default defineConfig({
    ...baseConfig,

    root: path.resolve(__dirname, './src'),

    plugins: [
        ...baseConfig.plugins,
        react(),
        // Client-specific plugins
    ],

    server: {
        ...baseConfig.server,
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            }
        }
    },

    build: {
        ...baseConfig.build,
        outDir: '../dist/client',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html')
            }
        }
    }
});
