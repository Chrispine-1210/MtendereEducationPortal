import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            "@/": path.resolve(import.meta.dirname, "./client", "./client/src/main"),
            "@server/": path.resolve(import.meta.dirname, "./server/index"),            
            "@shared/": path.resolve(import.meta.dirname, "./shared/schema"),
        },
    },
    root: path.resolve(import.meta.dirname, "./client",),
    build: {
        outDir: path.resolve(import.meta.dirname, "./dist/public"),
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        },
        fs: {
            strict: true,
            deny: ["**/.*"],
        },
    },
});
