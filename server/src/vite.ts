import type { Express } from "express";
import type { Server } from "http";
import { createServer as createViteServer, ViteDevServer } from "vite";
import express from "express";
import path from "path";
import fs from "fs";

let vite: ViteDevServer | undefined;

/**
 * Sets up Vite middleware for development mode.
 */
export async function setupVite(app: Express, server: Server) {
  vite = await createViteServer({
    server: { middlewareMode: true },
    root: path.resolve(__dirname, "../../client"),
    appType: "custom",
  });

  app.use(vite.middlewares);

  server.on("close", async () => {
    if (vite) {
      await vite.close();
      log("🔌 Vite dev server closed.");
    }
  });

  log("⚡ Vite dev middleware attached.");
}

/**
 * Serves static files from the frontend build in production.
 */
export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../../dist/public");

  if (!fs.existsSync(distPath)) {
    console.error("❌ Static build directory not found:", distPath);
    return;
  }

  app.use(express.static(distPath));

  // Fallback to index.html for SPA routing
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  log("📦 Serving static files from: " + distPath);
}

/**
 * Simple log utility.
 */
export function log(message: string) {
  console.log(`[🌀 MtendereServer] ${message}`);
}

