import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Add this import
import baseConfig from '../vite.base.config';

export default defineConfig({
    ...baseConfig,

    // Explicit root configuration
    root: path.resolve(__dirname, '.'),

    plugins: [
        ...(baseConfig.plugins || []), // Safely spread base plugins
        react()
    ],

    resolve: {
        alias: {
            ...baseConfig.resolve?.alias, // Inherit base aliases
            '@': path.resolve(__dirname, './src') // Add client-specific alias
        }
    },

    server: {
        port: 3000,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    },

    build: {
        outDir: '../dist/client',
        emptyOutDir: true
    }
});

