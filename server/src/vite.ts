import type { Express } from "express";
import type { Server } from "http";
import { createServer as createViteServer, ViteDevServer } from "vite";
import path from "path";
import fs from "fs";
import express from "express";

let vite: ViteDevServer | undefined;

export async function setupVite(app: Express, server: Server) {
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    root: path.resolve(__dirname, "../../client"),
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



