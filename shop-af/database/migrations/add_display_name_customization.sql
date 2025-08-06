-- Migration to add display name customization fields to profiles table
-- Run this in your Supabase SQL editor
--
-- New Text Effects:
-- - list: Clean Drop Shadow (layered, crisp shadows)
-- - dropdown: Shimmering Sparkle (animated highlight sweep)
-- - sparkle: Refined Neon (subtle glow effect)
-- - neon: Bright Glow Effect (enhanced neon)
-- - outline: Left-Aligned Outline (precise stroke)

-- Add display name customization columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS display_name_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS display_name_font TEXT DEFAULT 'inter' CHECK (display_name_font IN ('merriweather', 'poppins', 'orbitron', 'montserrat', 'inter', 'papyrus', 'sansserif'));

-- Add comments for documentation
COMMENT ON COLUMN profiles.display_name_color IS 'Hex color code for display name text';
COMMENT ON COLUMN profiles.display_name_font IS 'Font family for display name: merriweather, poppins, orbitron, montserrat, inter, papyrus, or sansserif';

-- Update existing profiles to have default values
UPDATE profiles
SET
  display_name_color = '#FFFFFF',
  display_name_font = 'inter'
WHERE
  display_name_color IS NULL
  OR display_name_font IS NULL;

-- Create index for performance (optional)
CREATE INDEX IF NOT EXISTS idx_profiles_display_customization ON profiles(display_name_font);
