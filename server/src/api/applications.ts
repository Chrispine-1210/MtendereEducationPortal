import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    jobId: integer("job_id").notNull(),
    status: text("status").default("pending"),
    coverLetter: text("cover_letter"),
    resumeUrl: text("resume_url"),
    createdAt: timestamp("created_at").defaultNow(),
});
