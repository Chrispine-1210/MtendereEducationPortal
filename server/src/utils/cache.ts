// src/utils/cache.ts
import { redis } from "../config/redis";

export const cacheSet = async (key: string, value: any, ttlSeconds = 3600) => {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
};

export const cacheGet = async (key: string) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

export const cacheDelete = async (key: string) => {
    await redis.del(key);
};
