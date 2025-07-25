import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  content: text("content"), // for rich WYSIWYG HTML
  createdAt: timestamp("created_at").defaultNow(),
});
