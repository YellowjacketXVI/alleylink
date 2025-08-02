-- QUICK FIX: Run this in your Supabase SQL Editor
-- This will fix the customization and analytics errors

-- 1. Add display name customization columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS display_name_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS display_name_font TEXT DEFAULT 'inter' CHECK (display_name_font IN ('merriweather', 'poppins', 'orbitron', 'montserrat', 'inter', 'papyrus', 'sansserif'));

-- 2. Create click_analytics table for tracking product clicks
CREATE TABLE IF NOT EXISTS click_analytics (
  id BIGSERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create profile_view_analytics table for tracking profile views
CREATE TABLE IF NOT EXISTS profile_view_analytics (
  id BIGSERIAL PRIMARY KEY,
  profile_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_click_analytics_product_id ON click_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_profile_view_analytics_profile_user_id ON profile_view_analytics(profile_user_id);

-- 5. Enable RLS and add policies
ALTER TABLE click_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_view_analytics ENABLE ROW LEVEL SECURITY;

-- Click analytics policies
CREATE POLICY "Users can view click analytics for their products" ON click_analytics
FOR SELECT USING (
  product_id IN (
    SELECT id FROM products WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Allow inserting click analytics" ON click_analytics
FOR INSERT WITH CHECK (true);

-- Profile view analytics policies
CREATE POLICY "Users can view their profile analytics" ON profile_view_analytics
FOR SELECT USING (profile_user_id = auth.uid());

CREATE POLICY "Allow inserting profile view analytics" ON profile_view_analytics
FOR INSERT WITH CHECK (true);

-- 6. Update existing profiles to have default values
UPDATE profiles 
SET 
  display_name_color = '#FFFFFF',
  display_name_font = 'inter'
WHERE 
  display_name_color IS NULL 
  OR display_name_font IS NULL;
