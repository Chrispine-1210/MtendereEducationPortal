import type { Express } from "express";
import type { Server } from "http";
import type { ViteDevServer } from "vite";
import path from "path";
import {createServer as createServer} from "vite";

let vite: ViteDevServer;

export const setupVite = async (app: Express, server: Server) => {
  const viteModule = await import("vite");
  console.log(viteModule), viteModule;
  const createViteServer = viteModule.default.createServer;

  if (!createServer) {
    throw new Error ("createServer is not found in vite Module import");
  }

  vite = await createViteServer({
    server: { middlewareMode: true },
    root: path.resolve(__dirname, "../../client"),
    appType: "custom",
  });

  app.use(vite.middlewares);

  server.on("close", async () => {
    if (vite) await vite.close();
  });

  console.log(createServer);
};