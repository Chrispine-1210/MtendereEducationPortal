import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    location: text("location"),
    type: text("type"), // e.g., full-time, part-time, remote
    link: text("link"),
    createdAt: timestamp("created_at").defaultNow(),
});
