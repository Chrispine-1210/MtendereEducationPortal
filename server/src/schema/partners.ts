import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const partners = pgTable("partners", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    link: text("link"),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at").defaultNow(),
});
