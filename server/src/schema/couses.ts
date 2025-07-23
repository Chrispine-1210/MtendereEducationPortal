import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow(),
});
