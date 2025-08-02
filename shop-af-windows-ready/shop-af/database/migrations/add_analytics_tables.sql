-- Migration to add analytics tracking tables
-- Run this in your Supabase SQL editor

-- Create click_analytics table for tracking product clicks
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

-- Create profile_view_analytics table for tracking profile views
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_click_analytics_product_id ON click_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_user_id ON click_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_clicked_at ON click_analytics(clicked_at);

CREATE INDEX IF NOT EXISTS idx_profile_view_analytics_profile_user_id ON profile_view_analytics(profile_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_view_analytics_viewer_user_id ON profile_view_analytics(viewer_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_view_analytics_viewed_at ON profile_view_analytics(viewed_at);

-- Add RLS policies
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

-- Comments for documentation
COMMENT ON TABLE click_analytics IS 'Tracks successful product link clicks for analytics';
COMMENT ON TABLE profile_view_analytics IS 'Tracks profile page views for analytics';

COMMENT ON COLUMN click_analytics.product_id IS 'ID of the product that was clicked';
COMMENT ON COLUMN click_analytics.user_id IS 'ID of the user who clicked (if authenticated)';
COMMENT ON COLUMN click_analytics.clicked_at IS 'Timestamp when the click occurred';

COMMENT ON COLUMN profile_view_analytics.profile_user_id IS 'ID of the user whose profile was viewed';
COMMENT ON COLUMN profile_view_analytics.viewer_user_id IS 'ID of the user who viewed the profile (if authenticated)';
COMMENT ON COLUMN profile_view_analytics.viewed_at IS 'Timestamp when the profile was viewed';
