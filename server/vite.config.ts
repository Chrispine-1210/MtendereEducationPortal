// server/vite.config.ts
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
    server: {
        port: 3001
    },
    plugins: [
        VitePluginNode({
            adapter: 'express',
            appPath: './index.ts',
            exportName: 'app',
            tsCompiler: 'esbuild'
        })
    ]
});

