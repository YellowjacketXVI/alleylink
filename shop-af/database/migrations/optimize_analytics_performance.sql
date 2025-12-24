-- Migration to optimize analytics performance
-- Run this in your Supabase SQL editor

-- Add composite indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_click_analytics_user_product ON click_analytics(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_profile_view_analytics_profile_user_viewed_at ON profile_view_analytics(profile_user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_click_analytics_product_clicked_at ON click_analytics(product_id, clicked_at DESC);

-- Add partial indexes for active products only
CREATE INDEX IF NOT EXISTS idx_products_user_active ON products(user_id) WHERE is_active = true;

-- Add index for faster counting operations
CREATE INDEX IF NOT EXISTS idx_click_analytics_count ON click_analytics(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profile_view_analytics_count ON profile_view_analytics(profile_user_id) WHERE profile_user_id IS NOT NULL;

-- Create a materialized view for faster analytics aggregation (optional, for high-traffic scenarios)
-- This can be refreshed periodically instead of calculating on every request
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_summary AS
SELECT 
  p.user_id,
  p.id as product_id,
  p.title as product_title,
  COUNT(ca.id) as click_count,
  MAX(ca.clicked_at) as last_clicked_at
FROM products p
LEFT JOIN click_analytics ca ON p.id = ca.product_id
WHERE p.is_active = true
GROUP BY p.user_id, p.id, p.title;

-- Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_analytics_summary_user_id ON analytics_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_summary_clicks ON analytics_summary(user_id, click_count DESC);

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW analytics_summary;
END;
$$;

-- Grant permissions
GRANT SELECT ON analytics_summary TO authenticated;
GRANT SELECT ON analytics_summary TO anon;

-- Comments for documentation
COMMENT ON MATERIALIZED VIEW analytics_summary IS 'Aggregated analytics data for faster dashboard queries';
COMMENT ON FUNCTION refresh_analytics_summary() IS 'Refreshes the analytics summary materialized view';