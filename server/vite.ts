import { createServer as createViteServer, InlineConfig } from "vite";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: express.Express) {
  const viteConfig: InlineConfig = {
    server: { middlewareMode: true },
    appType: "custom", // avoid Vite's default HTML handling
    root: path.resolve(__dirname, "../client"),
  };

  const vite = await createViteServer(viteConfig);

  app.use(vite.middlewares); // attach Vite middleware to Express
}
