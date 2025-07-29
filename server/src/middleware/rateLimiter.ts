// src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

export const rateLimiter = (limit: number, windowSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const key = `rate:${req.ip}`;
        const count = await redis.incr(key);

        if (count === 1) {
            await redis.expire(key, windowSeconds); // set expiration for this key
        }

        if (count > limit) {
            return res.status(429).json({
                success: false,
                message: "Too many requests, please try again later."
            });
        }

        next();
    };
};
