import { VitePluginNode } from 'vite-plugin-node';
// client/vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            react(),
            VitePluginNode({
                adapter: "express",
                appPath: "../server/index.ts",
                exportName: "app",
                tsCompiler: "esbuild",
            }),
        ],
        server: {
            strictPort: true,
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE,
                    changeOrigin: true,
                    secure: false,
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
                '@': path.resolve(__dirname, './src'),
                '@shared': path.resolve(__dirname, '../shared'),
            },
        },
        ssr: {
            noExternal: []
        }
    };
});
