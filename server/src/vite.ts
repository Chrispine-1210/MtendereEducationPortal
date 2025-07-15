import express, { type Request, Response, NextFunction } from "express";
import http from "http";
import { registerRoutes } from "./registerRoutes";
import { setupVite, serveStatic, log } from "./vite";

import { Express } from "express";
import { createServer as createViteServer, ViteDevServer } from "vite";
import type { Server } from "http";
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

export const serveStatic = (app: Express) => {
  const root = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(root));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(root, "index.html"));
  });
};

export const log = console.log;

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(app, server); // ✅ now includes server

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server); // ✅ works with http.Server
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();

