-- Migration: 0008_add_missing_columns
-- Description: Add missing vehicle_id to bookings and duration_min to services
-- Date: 2025-09-28

-- Add vehicle_id column to bookings table
ALTER TABLE bookings ADD COLUMN vehicle_id TEXT REFERENCES vehicles(id);

-- Add duration_min column to services table (if not exists)
-- This might fail if the column already exists, but that's okay
ALTER TABLE services ADD COLUMN duration_min INTEGER;