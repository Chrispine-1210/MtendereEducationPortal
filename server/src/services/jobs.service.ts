import { db } from "../config/db";
import { jobs } from "../models/jobs.model";
import { cacheGet, cacheSet, cacheDelete } from "../utils/cache";
import { eq } from "drizzle-orm";

export class JobsService {
  static async getAllJobs() {
    const cached = await cacheGet("jobs:all");
    if (cached) return cached;

    const allJobs = await db.select().from(jobs);
    await cacheSet("jobs:all", allJobs, 300);
    return allJobs;
  }

  static async getJobById(id: number) {
    const cached = await cacheGet(`job:${id}`);
    if (cached) return cached;

    const job = await db.query.jobs.findFirst({ where: { id } });
    if (!job) throw new Error("Job not found");

    await cacheSet(`job:${id}`, job, 300);
    return job;
  }

  static async createJob(data: typeof jobs.$inferInsert) {
    const [newJob] = await db.insert(jobs).values(data).returning();
    await cacheDelete("jobs:all");
    return newJob;
  }

  static async updateJob(id: number, data: Partial<typeof jobs.$inferInsert>) {
    const [updatedJob] = await db.update(jobs).set(data).where(eq(jobs.id, id)).returning();
    await cacheDelete(`job:${id}`);
    await cacheDelete("jobs:all");
    return updatedJob;
  }

  static async deleteJob(id: number) {
    await db.delete(jobs).where(eq(jobs.id, id));
    await cacheDelete(`job:${id}`);
    await cacheDelete("jobs:all");
  }
}
