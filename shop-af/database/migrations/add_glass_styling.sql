-- Migration to add glass styling fields to profiles table
-- Run this in your Supabase SQL editor

-- Add glass styling columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS glass_mode TEXT DEFAULT 'matte' CHECK (glass_mode IN ('matte', 'gloss')),
ADD COLUMN IF NOT EXISTS glass_tint TEXT DEFAULT '#FFFFFF';

-- Add comments for documentation
COMMENT ON COLUMN profiles.glass_mode IS 'Glass card material style: matte (frosted) or gloss (crystal)';
COMMENT ON COLUMN profiles.glass_tint IS 'Hex color code for glass tint overlay';

-- Update existing profiles to have default values
UPDATE profiles
SET
  glass_mode = 'matte',
  glass_tint = '#FFFFFF'
WHERE
  glass_mode IS NULL
  OR glass_tint IS NULL;

