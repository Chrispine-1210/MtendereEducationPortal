import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import http from "http";

import { registerRoutes } from "./registerRoutes";
import { setupVite, serveStatic, log } from "./vite";
import { initWebSocket } from "./modules/websocket/socket";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware (unchanged)

const server = http.createServer(app);

(async () => {
  await registerRoutes(app);
  app.use(errorHandler);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`Server running on port ${port}`);
  });

  initWebSocket(server);
})();
