// server/index.ts

// ------------------------------
// 1) Environment Setup
// ------------------------------
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

logger.info("Server starting...");
console.log("[env] NODE_ENV =", process.env.NODE_ENV || "development");
console.log("[env] DATABASE_URL =", process.env.DATABASE_URL ? "[REDACTED]" : "undefined");

// ------------------------------
// 2) Core Imports
// ------------------------------
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes.js";

const app = express();
const isDev = process.env.NODE_ENV !== "production";
const PORT = Number(process.env.PORT || 3001);

// ------------------------------
// 3) Middleware
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ------------------------------
// 4) API Routes
// ------------------------------
(async () => {
  try {
    await registerRoutes(app);

    // ------------------------------
    // 5) Frontend Serving
    // ------------------------------
    if (!isDev) {
      const clientDistPath = path.resolve(__dirname, "../client/dist");
      app.use(express.static(clientDistPath));
      app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(clientDistPath, "index.html"));
      });
      logger.info("Serving frontend from /client/dist");
    }
    

    // ------------------------------
    // 6) Error Handler
    // ------------------------------
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      logger.error(`[${status}] ${message}`);
      res.status(status).json({ message });
    });

    // ------------------------------
    // 7) Start Server
    // ------------------------------
    app.listen(PORT, () => {
      console.log(`🚀 Mtendere Server running at http://127.0.0.1:${PORT}`);
      if (isDev) {
        console.log(`💻 Frontend (Vite) → http://127.0.0.1:3000`);
      }
    });

  } catch (e) {
    logger.error("❌ Failed to start server: " + (e as Error).message);
    process.exit(1);
  }
})();
