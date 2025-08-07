// 1) Load environment variables (ESM-safe)
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });


// 2) Logger
import logger from "./utils/logger";
logger.info(`[env] Loaded .env from ${envPath}`);
logger.info(`[env] DATABASE_URL = ${process.env.DATABASE_URL ? "[REDACTED]" : "undefined"}`);


// 3) Core server imports
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";


const app = express();


// 4) Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// 5) Main bootstrap
(async () => {
  try {
    const server = await registerRoutes(app);


    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";


      logger.error(`[server-error] ${message}`);
      res.status(status).json({ message });
    });


    // Vite only in dev
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }


    // Start server
    const PORT = Number(process.env.PORT || 3001);
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running on http://localhost:${PORT} (${app.get("env")})`);
    });


  } catch (e) {
    logger.error(`❌ Failed to start server: ${(e as Error).message}`);
    process.exit(1);
  }
})();

