import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").default("user"), // admin or user
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});
