// src/server.ts
import http from "http";
import { createApp } from "./app";
import { loadEnv } from "./config/env";
import { logger } from "./config/logger";

loadEnv(); // Load and validate env vars

const app = createApp();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

/** ✅ Start Server */
server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

/** ✅ Graceful Shutdown */
const shutdown = (signal: string) => {
  logger.info(`\n⚠️ Received ${signal}. Shutting down...`);
  server.close(() => {
    logger.info("✅ HTTP server closed.");
    process.exit(0);
  });
};

["SIGINT", "SIGTERM"].forEach(sig => process.on(sig, () => shutdown(sig)));
