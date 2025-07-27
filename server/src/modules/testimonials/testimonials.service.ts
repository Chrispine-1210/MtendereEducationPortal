import { db } from "../../config/db";
import { testimonials } from "../../schema/testimonials";
import { eq } from "drizzle-orm";

export const getAllTestimonials = () => db.select().from(testimonials);

export const createTestimonial = (data: any) => db.insert(testimonials).values(data).returning();

export const updateTestimonial = (id: number, data: any) =>
  db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();

export const deleteTestimonial = (id: number) =>
  db.delete(testimonials).where(eq(testimonials.id, id)).returning();
