import { db } from "../../config/db";
import { courses } from "../../schema/courses";
import { eq } from "drizzle-orm";

export const getAllCourses = () => db.select().from(courses);

export const createCourse = (data: any) => db.insert(courses).values(data).returning();

export const updateCourse = (id: number, data: any) =>
  db.update(courses).set(data).where(eq(courses.id, id)).returning();

export const deleteCourse = (id: number) =>
  db.delete(courses).where(eq(courses.id, id)).returning();
