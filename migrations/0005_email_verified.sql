-- Migration: 0005_email_verified
-- Description: Add email_verified column to users table for email verification functionality
-- Date: 2025-09-26

-- Add email_verified column to users table
ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0 CHECK (email_verified IN (0, 1));

-- Update trigger for users table (already exists, but ensure it covers new fields)
-- The existing trigger should handle the updated_at field automatically