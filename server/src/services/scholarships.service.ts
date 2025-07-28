import { db } from "../config/db";
import { scholarships } from "../schema/scholarships";
import { eq } from "drizzle-orm";

export const getAllScholarships = () => db.select().from(scholarships);

export const createScholarship = (data: any) =>
  db.insert(scholarships).values(data).returning();

export const updateScholarship = (id: number, data: any) =>
  db.update(scholarships).set(data).where(eq(scholarships.id, id)).returning();

export const deleteScholarship = (id: number) =>
  db.delete(scholarships).where(eq(scholarships.id, id)).returning();
