import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { Session } from "express-session";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import http from "http";

import { registerRoutes } from "./registerRoutes";
import { setupVite, serveStatic, log } from "./vite";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/courses.routes";
import jobsRoutes from "./routes/jobs.routes";
import testimonialsRoutes from "./routes/testimonials.routes";
import applicationsRoutes from "./routes/applications.routes";
import usersRoutes from "./routes/users.routes"
import scholarshipsRoutes  from "./routes/scholarships.routes";
import partnersRoutes from "./routes/partners.routes";
import teamRoutes from "./routes/team.routes";
import schema from "./schema/schema";
import { db } from "./config/db";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/scholarships", scholarshipsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/partners", partnersRoutes);

app.get("/", (_, res) => res.send("Mtendere API Running"));

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

async function startServer() {
  try {
    await registerRoutes(app, server);

    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`Server running on http://localhost:${5000}`);
    });
  } catch (err) {
    console.error("Fatal server startup error:", err);
    process.exit(1);
  }
}

startServer();
