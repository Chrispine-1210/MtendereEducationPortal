import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    company: text("company").notNull(),
    location: text("location").notNull(),
    imageUrl: text("image_url"), // company logo
    link: text("link"), // application link or external page
    createdAt: timestamp("created_at").defaultNow(),
});  