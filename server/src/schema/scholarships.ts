import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const scholarships = pgTable("scholarships", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    link: text("link"),
    createdAt: timestamp("created_at").defaultNow(),
});
