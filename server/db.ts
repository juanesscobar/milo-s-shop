import 'dotenv/config';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Extract the file path from DATABASE_URL (e.g., "file:./milos_shop.db" -> "./milos_shop.db")
const dbPath = process.env.DATABASE_URL.replace('file:', '');

export const sqlite = new Database(dbPath);
export const db = drizzle({ client: sqlite, schema });
