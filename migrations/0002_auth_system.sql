-- Migration: 0002_auth_system
-- Description: Create production-ready authentication system tables
-- Date: 2025-09-24

-- Drop existing users table to recreate with proper structure
DROP TABLE IF EXISTS users;

-- Create companies table for admin management
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Create production-ready users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE, -- Unique email constraint
    phone TEXT NOT NULL UNIQUE, -- Unique phone constraint
    password_hash TEXT NOT NULL, -- Never exposed in API responses
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    company_id INTEGER, -- Nullable integer for admins only
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create sessions table for session management
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    data TEXT NOT NULL, -- Serialized session data
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Update trigger for users table
CREATE TRIGGER update_users_updated_at
    AFTER UPDATE ON users
    FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

-- Update trigger for companies table
CREATE TRIGGER update_companies_updated_at
    AFTER UPDATE ON companies
    FOR EACH ROW
BEGIN
    UPDATE companies SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;
END;

-- Clean up expired sessions trigger (can be called periodically)
-- This would typically be done by a cron job or background process