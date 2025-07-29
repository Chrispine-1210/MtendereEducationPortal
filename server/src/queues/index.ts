import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const emailQueue = new Queue("emailQueue", {
    connection: redis,
});

export const jobProcessingQueue = new Queue("jobProcessingQueue", {
    connection: redis,
});
