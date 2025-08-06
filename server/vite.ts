// server/vite-middleware.ts
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, type UserConfig } from "vite";
import { type Server as HttpServer } from "http";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

/**
 * Color codes for terminal output
 */
const colors = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
};

/**
 * Custom logger with levels
 */
export const logger = {
  info(msg: string, source = "app") {
    console.log(`${colors.green}[INFO]${colors.reset} ${time()} [${source}] ${msg}`);
  },
  warn(msg: string, source = "app") {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${time()} [${source}] ${msg}`);
  },
  error(msg: string | Error, source = "app") {
    const message = msg instanceof Error ? msg.stack || msg.message : msg;
    console.error(`${colors.red}[ERROR]${colors.reset} ${time()} [${source}] ${message}`);
  },
  debug(msg: string, source = "app") {
    if (process.env.DEBUG) {
      console.log(`${colors.blue}[DEBUG]${colors.reset} ${time()} [${source}] ${msg}`);
    }
  },
};

function time() {
  return colors.gray + new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }) + colors.reset;
}

/**
 * Setup Vite as middleware.
 */
export async function setupVite(
  app: Express,
  httpServer?: HttpServer,
  viteConfig?: UserConfig,
) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const serverOptions = {
    middlewareMode: true,
    ...(httpServer ? { hmr: { server: httpServer } } : {}),
    allowedHosts: "auto" as const,
  };

  logger.info("Starting Vite dev server...", "vite");

  const vite = await createViteServer({
    ...((viteConfig as UserConfig) ?? {}),
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).type("html").send(page);

      logger.debug(`Served ${url}`, "vite-middleware");
    } catch (e) {
      if (typeof (vite as any).ssrFixStacktrace === "function") {
        (vite as any).ssrFixStacktrace(e as Error);
      }
      logger.error(e as Error, "vite-middleware");
      next(e);
    }
  });
}

/**
 * Serve built static assets in production
 */
export function serveStatic(app: Express) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(__dirname, "..", "client", "dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Build directory not found: ${distPath}. Run "npm run build" first.`,
    );
  }

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  logger.info("Serving static assets from dist", "static");
}

