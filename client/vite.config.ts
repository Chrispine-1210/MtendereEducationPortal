// client/vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        server: {
            port: 3000,
            strictPort: true,
            proxy: {
                '/api': {
                    target: env.VITE_SERVER_URL || 'http://localhost:3001',
                    changeOrigin: true,
                    secure: false,
                },
                '/auth': {
                    target: env.VITE_SERVER_URL || 'http://localhost:3001',
                    changeOrigin: true,
                    secure: false,
                },
                '/socket.io': {
                    target: env.VITE_SERVER_URL || 'http://localhost:3001',
                    ws: true,
                    changeOrigin: true,
                },
            },
        },
        build: {
            outDir: path.resolve(__dirname, '../dist/public'),
            sourcemap: mode === 'development',
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom'],
                    },
                },
            },
        },
        resolve: {
            alias: {
                '@client': path.resolve(__dirname, './src'),
                '@shared': path.resolve(__dirname, '../shared/schema.ts'),
            },
        },
    };
});
