import { db } from "../config/db";
import { partners } from "../schema/partners";
import { eq } from "drizzle-orm";

export const getAllPartners = () => db.select().from(partners);

export const createPartner = (data: any) =>
  db.insert(partners).values(data).returning();

export const updatePartner = (id: number, data: any) =>
  db.update(partners).set(data).where(eq(partners.id, id)).returning();

export const deletePartner = (id: number) =>
  db.delete(partners).where(eq(partners.id, id)).returning();
