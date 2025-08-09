import { pgTable, serial, varchar, integer, jsonb, text, timestamp, boolean, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const analytics = pgTable("analytics", {
	id: serial().primaryKey().notNull(),
	event: varchar({ length: 100 }).notNull(),
	userId: integer("user_id"),
	metadata: jsonb(),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	timestamp: timestamp({ mode: 'string' }).defaultNow(),
});

export const applications = pgTable("applications", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	type: varchar({ length: 50 }).notNull(),
	referenceId: integer("reference_id").notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(),
	documents: jsonb(),
	notes: text(),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	excerpt: text(),
	imageUrl: text("image_url"),
	category: varchar({ length: 100 }).notNull(),
	tags: text().array(),
	isPublished: boolean("is_published").default(false),
	authorId: integer("author_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const jobs = pgTable("jobs", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	company: text().notNull(),
	location: text().notNull(),
	salary: integer(),
	currency: varchar({ length: 10 }).default('USD'),
	jobType: varchar("job_type", { length: 50 }).notNull(),
	requirements: jsonb(),
	benefits: jsonb(),
	isRemote: boolean("is_remote").default(false),
	deadline: timestamp({ mode: 'string' }),
	isActive: boolean("is_active").default(true),
	createdBy: integer("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const partners = pgTable("partners", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	logoUrl: text("logo_url"),
	website: text(),
	country: text(),
	studentCount: integer("student_count"),
	ranking: text(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const referrals = pgTable("referrals", {
	id: serial().primaryKey().notNull(),
	referrerId: integer("referrer_id").notNull(),
	referredUserId: integer("referred_user_id"),
	referredEmail: varchar("referred_email", { length: 255 }).notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(),
	rewardAmount: integer("reward_amount").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
});

export const scholarships = pgTable("scholarships", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	institution: text().notNull(),
	country: text().notNull(),
	amount: integer(),
	currency: varchar({ length: 10 }).default('USD'),
	deadline: timestamp({ mode: 'string' }).notNull(),
	requirements: jsonb(),
	category: varchar({ length: 100 }).notNull(),
	imageUrl: text("image_url"),
	isActive: boolean("is_active").default(true),
	createdBy: integer("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const teamMembers = pgTable("team_members", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	position: text().notNull(),
	bio: text(),
	imageUrl: text("image_url"),
	email: varchar({ length: 255 }),
	linkedin: text(),
	twitter: text(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const testimonials = pgTable("testimonials", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	content: text().notNull(),
	rating: integer().notNull(),
	imageUrl: text("image_url"),
	isApproved: boolean("is_approved").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	role: varchar({ length: 50 }).default('user').notNull(),
	profilePicture: text("profile_picture"),
	phone: varchar({ length: 20 }),
	dateOfBirth: timestamp("date_of_birth", { mode: 'string' }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);
