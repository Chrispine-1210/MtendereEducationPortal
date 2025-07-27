import { db } from "../../config/db";
import { jobs } from "../../api/jobs";
import { eq } from "drizzle-orm";

export const getAllJobs = () => db.select().from(jobs);

export const getJobById = (id: number) =>
  db.select().from(jobs).where(eq(jobs.id, id)).then(r => r[0]);

export const createJob = (data: any) =>
  db.insert(jobs).values(data).returning();

export const updateJob = (id: number, data: any) =>
  db.update(jobs).set(data).where(eq(jobs.id, id)).returning();

export const deleteJob = (id: number) =>
  db.delete(jobs).where(eq(jobs.id, id)).returning();

