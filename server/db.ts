// server/db.ts
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";


// Load .env before doing anything else
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });


import { neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import pg from "pg";
import ws from "ws";
import * as schema from "../shared/schema";


neonConfig.webSocketConstructor = ws;


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}


export const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});
export const db = drizzle( pool, { schema });
