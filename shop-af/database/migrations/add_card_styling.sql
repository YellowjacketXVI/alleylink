-- Migration to add card styling fields to profiles table
-- Run this in your Supabase SQL editor

-- Add card styling columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS card_style TEXT DEFAULT 'light' CHECK (card_style IN ('light', 'dark', 'custom')),
ADD COLUMN IF NOT EXISTS card_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS card_text_color TEXT DEFAULT '#000000';

-- Add comments for documentation
COMMENT ON COLUMN profiles.card_style IS 'Card styling preset: light, dark, or custom';
COMMENT ON COLUMN profiles.card_color IS 'Hex color code for card background';
COMMENT ON COLUMN profiles.card_text_color IS 'Hex color code for card text';

-- Update existing profiles to have default values
UPDATE profiles
SET
  card_style = 'light',
  card_color = '#FFFFFF',
  card_text_color = '#000000'
WHERE
  card_style IS NULL
  OR card_color IS NULL
  OR card_text_color IS NULL;

-- Create index for performance (optional)
CREATE INDEX IF NOT EXISTS idx_profiles_card_styling ON profiles(card_style);