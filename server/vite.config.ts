import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import baseConfig from '../vite.base.config';

export default defineConfig({
    ...baseConfig,

    plugins: [
        ...baseConfig.plugins,
        VitePluginNode({
            adapter: 'express',
            appPath: './index.ts',
            exportName: 'app',
            tsCompiler: 'esbuild'
        })
    ],

    server: {
        ...baseConfig.server,
        port: 3001,
        hmr: false // Disable HMR for server
    },

    build: {
        ...baseConfig.build,
        outDir: '../dist/server',
        ssr: true,
        rollupOptions: {
            input: './index.ts',
            output: {
                format: 'esm',
                entryFileNames: 'server.js'
            }
        }
    }
});
