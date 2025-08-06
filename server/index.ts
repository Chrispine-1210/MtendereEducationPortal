// server/index.ts

// 1) Load dotenv *first* and ESM-safe
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory (ESM-safe)
const envPath = path.resolve(__dirname, ".env");
dotenv.config({ path: envPath });

// debug
console.log("[env] loaded .env from", envPath);
console.log("[env] DATABASE_URL =", process.env.DATABASE_URL ? "[REDACTED]" : "undefined");

// 2) Now import the rest (these may depend on env vars)
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// remove or keep `register('ts-node/esm', ...)` only if you truly need it
// import { register } from 'node:module'
// import { pathToFileURL } from 'node:url'

// If you don't need the ts-node/esm registration at runtime, remove the lines below.
// register('ts-node/esm', pathToFileURL('./'))

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ... your existing middleware and performance logging ...

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // only setup vite in development and after routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Correct listen signature
  const PORT = Number(process.env.PORT || 3001);
  app.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
