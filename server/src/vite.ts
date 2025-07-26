import type { Express } from "express";
import type { Server } from "http";
import { ViteDevServer } from "vite";
import path from "path";
import fs from "fs";
import express from "express";

let vite: ViteDevServer | undefined;

/**
 * Attach Vite dev middleware and SSR rendering in development
 */
export async function setupVite(app: Express, server: Server) {
  vite = await createViteServer({
    server: { middlewareMode: true },
    root: path.resolve(__dirname, "../../client"),
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;

      // Load raw HTML
      let template = fs.readFileSync(
        path.resolve(__dirname, "../../client/index.html"),
        "utf-8"
      );

      // Apply Vite HTML transforms (e.g., inject scripts)
      template = await vite.transformIndexHtml(url, template);

      // SSR render
      const { render } = await vite.ssrLoadModule("/entry-server.tsx");
      const appHtml = render(url);

      const html = template.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite?.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  server.on("close", async () => {
    if (vite) await vite.close();
  });
}

/**
 * Serve pre-rendered HTML and SSR module in production
 */
export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../../dist/public");
  const ssrModulePath = path.resolve(__dirname, "../../dist/server/entry-server.js");

  if (!fs.existsSync(distPath)) {
    console.error("❌ Static build directory not found:", distPath);
    return;
  }

  app.use(express.static(distPath));

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
      const { render } = await import(ssrModulePath);
      const appHtml = render(url);
      const html = template.replace(`<!--app-html-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      next(e);
    }
  });
}

/**
 * Scoped logger
 */
export function log(message: string) {
  console.log(`[🌀 SSR] ${message}`);
}

