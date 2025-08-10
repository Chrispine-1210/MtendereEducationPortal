// server/index.ts
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Request, type Response, type NextFunction } from "express";
import { logger } from "./utils/logger.js";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const isDev = process.env.NODE_ENV !== "production";
const PORT = Number(process.env.PORT || 3001);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  try {
    await registerRoutes(app);

    if (!isDev) {
      const distPath = path.resolve(__dirname, "..", "client", "dist");
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
      logger.info("Serving static assets from dist", "static");
    }

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || 500;
      const message = err.message || "Internal Server Error";
      logger.error(`[${status}] ${message}`);
      res.status(status).json({ message });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://127.0.0.1:${PORT}`);
    });

  } catch (e) {
    logger.error("❌ Failed to start server: " + (e as Error).message);
    process.exit(1);
  }
})();
