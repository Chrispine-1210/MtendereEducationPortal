// server/vite.ts (UPDATED setupVite function)

import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";


const viteLogger = createLogger();


export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });


  console.log(`${formattedTime} [${source}] ${message}`);
}


export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };


  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });


  app.use(vite.middlewares); // ✅ Vite's middleware should come first to handle its assets.

  // ❌ REMOVE the problematic app.use("/api", ...) block here.
  // API routes should be handled by your dedicated API router in server/index.ts,
  // and they must be defined *before* the final catch-all HTML route.

  // This catch-all must come LAST for non-API routes to serve index.html.
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Filter out API calls and direct file requests (Vite's middleware or static serves these)
    // Only process requests that are likely for HTML pages (e.g., /, /dashboard, /settings)
    if (url.startsWith("/api") || url.includes(".") || req.method !== 'GET') {
      return next(); // Pass to the next middleware (e.g., your actual API routes or a 404 handler)
    }

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html", // Ensure this path is correct
      );

      // Always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`, // Add cache-buster
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e); // Pass errors to Express's error handling middleware
    }
  });
}

