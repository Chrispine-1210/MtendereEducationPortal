// src/models/users.model.ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    imageUrl: text("image_url"),
    content: text("content"), // for rich WYSIWYG HTML
    updatedAt: timestamp("updated_at").defaultNow()
});
