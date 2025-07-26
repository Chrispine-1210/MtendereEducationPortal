import { fileURLToPath } from "url";
import path from "path";
import express, { Express } from "express";
import type { Server } from "http";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let vite: ViteDevServer | undefined;

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
      let template = fs.readFileSync(
        path.resolve(__dirname, "../../client/index.html"),
        "utf-8"
      );

      template = await vite.transformIndexHtml(url, template);
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

export function log(message: string) {
  console.log(`[🌀 SSR] ${message}`);
}


