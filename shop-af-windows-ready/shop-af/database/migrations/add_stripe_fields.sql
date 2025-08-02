-- Migration to add Stripe-related fields to profiles table
-- Run this in your Supabase SQL editor

-- Add Stripe fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);

-- Add comments for documentation
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Stripe subscription ID for active subscriptions';

-- Update existing profiles to ensure they have proper default values
UPDATE profiles 
SET 
  subscription_status = COALESCE(subscription_status, 'free'),
  plan_type = COALESCE(plan_type, 'free')
WHERE 
  subscription_status IS NULL 
  OR plan_type IS NULL;
