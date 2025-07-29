// src/server.ts
import http from "http";
import { createApp } from "./app";
import { loadEnv } from "./config/env";
import { logger } from "./config/logger";
import { Server as SocketIOServer } from "socket.io";


loadEnv(); // ✅ Load environment variables


const app = createApp();
const PORT = process.env.PORT || 5000;


// ✅ Create HTTP server from Express app
const server = http.createServer(app);


// ✅ Attach Socket.IO to the same server
export const io = new SocketIOServer(server, {
  cors: { origin: "*" } // allow any origin for now, restrict in prod
});


// ✅ Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});


// ✅ Graceful Shutdown
const shutdown = (signal: string) => {
  logger.info(`\n⚠️ Received ${signal}. Shutting down...`);
  server.close(() => {
    logger.info("✅ HTTP server closed.");
    process.exit(0);
  });
};


// ✅ Handle termination signals (Docker/Kubernetes friendly)
["SIGINT", "SIGTERM"].forEach(sig => process.on(sig, () => shutdown(sig)));

