-- Migration: 0006_booking_fields
-- Description: Add payment and notes fields to bookings table
-- Date: 2025-09-28

-- Add payment method field to bookings table
ALTER TABLE bookings ADD COLUMN payment_method TEXT;

-- Add payment capture URL field to bookings table
ALTER TABLE bookings ADD COLUMN payment_capture_url TEXT;

-- Add notes field to bookings table
ALTER TABLE bookings ADD COLUMN notes TEXT;