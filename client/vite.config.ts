import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");


    return {
        plugins: [react()],
        server: {
            port: 3000,
            strictPort: true,
            proxy: {
                "/api": {
                    target: env.VITE_SERVER_URL || "http://localhost:3000",
                    changeOrigin: true,
                    secure: false,
                },
                "/auth": {
                    target: env.VITE_SERVER_URL || "http://localhost:3000",
                    changeOrigin: true,
                    secure: false,
                },
                "/socket.io": {
                    target: env.VITE_SERVER_URL || "http://localhost:3000",
                    ws: true,
                    changeOrigin: true,
                },
            },
        },
        build: {
            outDir: "dist",
            sourcemap: mode === "development",
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ["react", "react-dom"],
                    },
                },
            },
        },
        resolve: {
            alias: {
                "@": "/src",
            },
        },
    };
});

