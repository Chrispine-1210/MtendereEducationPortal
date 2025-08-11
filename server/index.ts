import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import express from "express";
import { logger } from "./utils/logger.ts";
import { registerRoutes } from "./routes.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Api Routes
app.use("/api", apiRoutes);

// Routes
registerRoutes(app);

// ======= PRODUCTION FRONTEND HANDLING =======
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../client/dist");

  // Serve static assets
  app.use(express.static(clientDist));

  // Catch-all for SPA
  app.get("*", (_, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
};

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

