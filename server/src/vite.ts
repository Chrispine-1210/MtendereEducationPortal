import type { Express } from "express";
import type { Server } from "http";
import { createServer as createViteServer, ViteDevServer } from "vite";
import path from "path";

let vite: ViteDevServer;

export const setupVite = async (app: Express, server: Server) => {
  vite = await createViteServer({
    server: { middlewareMode: true },
    root: path.resolve(__dirname, "../../client"),
    appType: "custom",
  });

  app.use(vite.middlewares);

  server.on("close", async () => {
    if (vite) await vite.close();
  });
};

