import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./users";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 1000 }),
  imageUrl: text("image_url"),
  content: text("content"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});
