import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure postgres client for development and production
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 1,
});

export const db = drizzle({ client, schema });

/**
 * Ejecuta migraciones de Drizzle desde la carpeta ./migrations
 * Idempotente: usa la tabla __drizzle_migrations
 */
export async function runMigrations(): Promise<void> {
  const start = Date.now();
  console.log('🏗️ Running database migrations...');
  await migrate(db, { migrationsFolder: 'migrations' });
  console.log(`✅ Migrations completed in ${Date.now() - start}ms`);
}
