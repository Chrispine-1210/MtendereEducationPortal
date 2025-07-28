// src/config/redis.ts
import { createClient } from "redis";
import { logger } from "./logger";

export const redis = createClient({ url: process.env.REDIS_URL });

redis.on("connect", () => logger.info("✅ Connected to Redis"));
redis.on("error", err => logger.error("Redis error: " + err));

redis.connect();
