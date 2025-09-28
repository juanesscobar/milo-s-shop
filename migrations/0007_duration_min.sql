-- Migration: 0007_duration_min
-- Description: Add duration_min field to services table
-- Date: 2025-09-28

-- Add duration_min field to services table
ALTER TABLE services ADD COLUMN duration_min INTEGER;