import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
    ],
    base: "./",
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "client", "src"),
            "@server": path.resolve(import.meta.dirname, "server"),
            "@shared": path.resolve(import.meta.dirname, "shared"),
        },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
    },
});
