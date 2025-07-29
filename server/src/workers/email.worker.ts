import { Worker } from "bullmq";
import { redis } from "../config/redis";

export const emailWorker = new Worker(
    "emailQueue",
    async job => {
        console.log("📧 Sending email:", job.data);
        // TODO: integrate with SES, SendGrid, or Nodemailer
    },
    { connection: redis }
);
