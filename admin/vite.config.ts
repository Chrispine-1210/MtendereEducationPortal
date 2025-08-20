import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Add these console logs
console.log("--- vite.config.ts loaded ---");
console.log("import.meta.dirname (vite.config.ts context):", import.meta.dirname);
console.log("Resolved root path:", path.resolve(import.meta.dirname, "./client"));
console.log("----------------------------");


export default defineConfig({
    plugins: [
        react(),
    ],
    base: "./",
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./client", "./src"),
            "@server": path.resolve(import.meta.dirname, "./server"),
            "@shared": path.resolve(import.meta.dirname, "./shared"),
        },
    },
    root: path.resolve(import.meta.dirname, "./client"),
    build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
    },
    server: {
        open: true,
        fs: {
            strict: true,
            deny: ["**/.*"],
        },
    },
});
