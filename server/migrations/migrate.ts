import 'dotenv/config';
import { db } from '../db';
import { sql } from 'drizzle-orm';

console.log('🔧 Migration script loaded');

/**
 * Migration script for authentication system
 * Applies database schema changes for production-ready auth
 */
async function runMigration() {
  console.log('🔄 Starting migration: Auth System');

  try {
    // Check current schema
    console.log('🔍 Checking current database schema...');
    const tables = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table'`);
    console.log('Current tables:', tables.map((t: any) => t.name));

    // Drop existing tables in correct order (reverse dependency order)
    console.log('🔄 Dropping existing tables...');
    await db.run(sql`PRAGMA foreign_keys = OFF`);
    await db.run(sql`DROP TABLE IF EXISTS sessions`);
    await db.run(sql`DROP TABLE IF EXISTS users`);
    await db.run(sql`DROP TABLE IF EXISTS companies`);
    await db.run(sql`PRAGMA foreign_keys = ON`);
    console.log('✅ Dropped existing tables');

    // Create companies table for admin management
    await db.run(sql`
      CREATE TABLE companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);
    console.log('✅ Created companies table');

    // Create production-ready users table
    console.log('🔄 Creating users table...');
    await db.run(sql`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
        company_id INTEGER,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (company_id) REFERENCES companies(id)
      )
    `);
    console.log('✅ Created users table with proper schema');

    // Verify the table was created correctly
    const userColumns = await db.all(sql`PRAGMA table_info(users)`);
    console.log('🔍 Users table columns:', userColumns.map((col: any) => `${col.name} (${col.type})`));

    // Create sessions table for session management
    await db.run(sql`
      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        data TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created sessions table');

    // Create indexes for better performance
    await db.run(sql`CREATE INDEX idx_users_email ON users(email)`);
    await db.run(sql`CREATE INDEX idx_users_phone ON users(phone)`);
    await db.run(sql`CREATE INDEX idx_users_role ON users(role)`);
    await db.run(sql`CREATE INDEX idx_users_company_id ON users(company_id)`);
    await db.run(sql`CREATE INDEX idx_sessions_user_id ON sessions(user_id)`);
    await db.run(sql`CREATE INDEX idx_sessions_expires_at ON sessions(expires_at)`);
    console.log('✅ Created database indexes');

    // Update trigger for users table
    await db.run(sql`
      CREATE TRIGGER update_users_updated_at
        AFTER UPDATE ON users
        FOR EACH ROW
      BEGIN
        UPDATE users SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
      END
    `);

    // Update trigger for companies table
    await db.run(sql`
      CREATE TRIGGER update_companies_updated_at
        AFTER UPDATE ON companies
        FOR EACH ROW
      BEGIN
        UPDATE companies SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
      END
    `);
    console.log('✅ Created update triggers');

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Execute migration directly
console.log('🚀 Starting migration script execution...');
runMigration()
  .then(() => {
    console.log('✅ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  });

export { runMigration };