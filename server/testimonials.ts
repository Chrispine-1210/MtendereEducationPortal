import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const testimonials = pgTable("testimonials", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    content: text("content").notNull(),
    imageUrl: text("image_url"),
    link: text("link"),
    createdAt: timestamp("created_at").defaultNow(),
});
