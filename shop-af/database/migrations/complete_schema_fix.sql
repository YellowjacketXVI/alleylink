-- =====================================================
-- COMPLETE SCHEMA FIX FOR ALLEYLINK
-- Run this in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. PROFILE_VIEW_ANALYTICS TABLE (MISSING!)
-- =====================================================

CREATE TABLE IF NOT EXISTS profile_view_analytics (
  id BIGSERIAL PRIMARY KEY,
  profile_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_view_analytics_profile_user_id ON profile_view_analytics(profile_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_view_analytics_viewed_at ON profile_view_analytics(viewed_at);

-- Enable RLS
ALTER TABLE profile_view_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their profile analytics" ON profile_view_analytics;
CREATE POLICY "Users can view their profile analytics" ON profile_view_analytics
FOR SELECT USING (profile_user_id = auth.uid());

DROP POLICY IF EXISTS "Allow inserting profile view analytics" ON profile_view_analytics;
CREATE POLICY "Allow inserting profile view analytics" ON profile_view_analytics
FOR INSERT WITH CHECK (true);

-- =====================================================
-- 2. UNIQUE CONSTRAINT ON USERNAME (CRITICAL!)
-- =====================================================

-- Add unique constraint on username to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_username_unique'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
  END IF;
END $$;

-- Add index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- =====================================================
-- 3. CLICK_ANALYTICS TABLE VERIFICATION
-- =====================================================

-- Ensure click_analytics exists with proper structure
CREATE TABLE IF NOT EXISTS click_analytics (
  id BIGSERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_click_analytics_product_id ON click_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_clicked_at ON click_analytics(clicked_at);

-- Enable RLS
ALTER TABLE click_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view click analytics for their products" ON click_analytics;
CREATE POLICY "Users can view click analytics for their products" ON click_analytics
FOR SELECT USING (
  product_id IN (
    SELECT id FROM products WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Allow inserting click analytics" ON click_analytics;
CREATE POLICY "Allow inserting click analytics" ON click_analytics
FOR INSERT WITH CHECK (true);

-- =====================================================
-- 4. USERNAME HISTORY TABLE (NEW - for tracking changes)
-- =====================================================

CREATE TABLE IF NOT EXISTS username_history (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_username TEXT NOT NULL,
  new_username TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_username_history_user_id ON username_history(user_id);
CREATE INDEX IF NOT EXISTS idx_username_history_old_username ON username_history(old_username);

-- Enable RLS
ALTER TABLE username_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own username history
DROP POLICY IF EXISTS "Users can view own username history" ON username_history;
CREATE POLICY "Users can view own username history" ON username_history
FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- 5. WHITELIST TABLE VERIFICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS whitelist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  granted_by_admin TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE whitelist ENABLE ROW LEVEL SECURITY;

-- Admins can manage whitelist
DROP POLICY IF EXISTS "Admins can manage whitelist" ON whitelist;
CREATE POLICY "Admins can manage whitelist" ON whitelist
FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM profiles WHERE is_admin = true)
);

-- =====================================================
-- 6. PROFILES TABLE - ENSURE ALL COLUMNS EXIST
-- =====================================================

-- Add any missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name_color TEXT DEFAULT '#FFFFFF';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name_font TEXT DEFAULT 'inter';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_type TEXT DEFAULT 'gradient';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_image TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_gradient_direction TEXT DEFAULT 'black';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS price_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false;

-- Indexes for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);

-- =====================================================
-- 7. PRODUCTS TABLE - ENSURE ALL COLUMNS EXIST
-- =====================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

-- =====================================================
-- 8. FUNCTION: GET EMAIL BY USERNAME (for login)
-- =====================================================

CREATE OR REPLACE FUNCTION get_email_by_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
BEGIN
    SELECT auth.users.email INTO user_email
    FROM profiles
    JOIN auth.users ON profiles.user_id = auth.users.id
    WHERE profiles.username = lower(username_input);
    
    RETURN user_email;
END;
$$;

GRANT EXECUTE ON FUNCTION get_email_by_username(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_email_by_username(text) TO anon;

-- =====================================================
-- 9. TRIGGER: LOG USERNAME CHANGES
-- =====================================================

CREATE OR REPLACE FUNCTION log_username_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.username IS DISTINCT FROM NEW.username THEN
    INSERT INTO username_history (user_id, old_username, new_username)
    VALUES (NEW.user_id, OLD.username, NEW.username);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_username_change ON profiles;
CREATE TRIGGER trigger_log_username_change
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_username_change();

-- =====================================================
-- 10. RLS POLICIES FOR PROFILES
-- =====================================================

-- Public can read profiles (for profile pages)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
FOR SELECT USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile" ON profiles
FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM profiles WHERE is_admin = true)
);

-- =====================================================
-- 11. RLS POLICIES FOR PRODUCTS
-- =====================================================

-- Public can view active products
DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products" ON products
FOR SELECT USING (is_active = true);

-- Users can manage their own products
DROP POLICY IF EXISTS "Users can manage own products" ON products;
CREATE POLICY "Users can manage own products" ON products
FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'products', 'click_analytics', 'profile_view_analytics', 'username_history', 'whitelist');

-- Check username unique constraint
SELECT conname FROM pg_constraint WHERE conname = 'profiles_username_unique';

