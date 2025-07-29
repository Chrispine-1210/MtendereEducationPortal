import { Request, Response } from "express";
import { db } from "../config/db";
import { redis } from "../config/redis";

export class HealthController {
    static async checkHealth(req: Request, res: Response) {
        try {
            // ✅ DB Check
            let dbStatus = "up";
            try {
                await db.execute("SELECT 1"); // lightweight ping query
            } catch {
                dbStatus = "down";
            }

            // ✅ Redis Check
            let redisStatus = "up";
            try {
                await redis.ping();
            } catch {
                redisStatus = "down";
            }

            res.json({
                status: "ok",
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                services: {
                    database: dbStatus,
                    redis: redisStatus,
                },
            });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message });
        }
    }
}
