// server/index.ts

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Request, type Response, type NextFunction } from "express";
import { logger } from "./utils/logger.ts";
import { registerRoutes } from "./routes.ts";
import { setupVite, serveStatic } from "./vite.ts"; // <-- here

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const isDev = process.env.NODE_ENV !== "production";
const PORT = Number(process.env.PORT || 3001);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  try {
    // Register backend API routes first
    await registerRoutes(app);

    if (isDev) {
      // Development mode — use Vite middleware
      await setupVite(app);
    } else {
      // Production mode — serve static dist
      serveStatic(app);
    }

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      logger.error(`[${status}] ${message}`);
      res.status(status).json({ message });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Mtendere Server running at http://127.0.0.1:${PORT}`);
      if (isDev) {
        console.log(`💻 Frontend served via Vite middleware on same port`);
      }
    });

  } catch (e) {
    logger.error("❌ Failed to start server: " + (e as Error).message);
    process.exit(1);
  }
})();
