-- Migration: 0004_mfa_fields
-- Description: Add MFA fields to users table for TOTP authentication
-- Date: 2025-09-25

-- Add MFA fields to users table
ALTER TABLE users ADD COLUMN mfa_secret TEXT;
ALTER TABLE users ADD COLUMN mfa_enabled INTEGER DEFAULT 0 CHECK (mfa_enabled IN (0, 1));
ALTER TABLE users ADD COLUMN mfa_backup_codes TEXT; -- JSON array of backup codes

-- Update trigger for users table (already exists, but ensure it covers new fields)
-- The existing trigger should handle the updated_at field automatically