import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts", // path to your schema files
  out: "./drizzle",             // migrations output folder
  driver: "pg",                 // or 'mysql2' / 'better-sqlite3'
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
} satisfies Config;