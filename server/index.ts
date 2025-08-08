// server/index.ts

// 1) Load dotenv first (ESM-safe)
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, ".env");
dotenv.config();

console.log("[env] Loaded .env from", envPath);
console.log("[env] DATABASE_URL =", process.env.DATABASE_URL ? "[REDACTED]" : "undefined");

// 2) Core imports (after dotenv)
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes"; // <-- Make sure you define this correctly

const app = express();

// 3) Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 4) Main bootstrap
(async () => {
  try {
    // Register your custom API routes
    const httpServer = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error(`[ERROR] ${message}`);
      res.status(status).json({ message });
    });

    const PORT = Number(process.env.PORT || 3001);

    app.listen(PORT, () => {
      console.log(`🚀 Mtendere Server running at http://localhost:${PORT}`);
    });

  } catch (e) {
    console.error("❌ Failed to start server:", e);
    process.exit(1);
  }
})();
