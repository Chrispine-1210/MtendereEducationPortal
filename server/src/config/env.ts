// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

export const loadEnv = () => {
    dotenv.config();

    const envSchema = z.object({
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
        PORT: z.string().optional(),
        DATABASE_URL: z.string(),
        JWT_SECRET: z.string(),
        REDIS_URL: z.string().optional()
    });

    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error("❌ Invalid ENV variables", parsed.error.flatten().fieldErrors);
        process.exit(1);
    }

    return parsed.data;
};
