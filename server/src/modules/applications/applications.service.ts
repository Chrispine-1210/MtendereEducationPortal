import { db } from "../../config/db";
import { applications } from "../../schema/applications";
import { eq } from "drizzle-orm";

export const getAllApplications = () => db.select().from(applications);

export const getApplicationsByUser = (userId: number) =>
  db.select().from(applications).where(eq(applications.userId, userId));

export const createApplication = (data: any) =>
  db.insert(applications).values(data).returning();

export const updateApplication = (id: number, data: any) =>
  db.update(applications).set(data).where(eq(applications.id, id)).returning();

export const deleteApplication = (id: number) =>
  db.delete(applications).where(eq(applications.id, id)).returning();
