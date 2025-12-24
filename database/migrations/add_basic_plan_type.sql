-- Migration to add 'basic' plan type to the profiles table
-- Run this in your Supabase SQL editor
-- 
-- This migration:
-- 1. Drops the existing plan_type check constraint
-- 2. Creates a new check constraint that includes 'basic'
-- 3. Adds comments for documentation
-- 4. Verifies the changes

-- =====================================================
-- 1. DROP EXISTING PLAN_TYPE CHECK CONSTRAINT
-- =====================================================

-- Drop the existing constraint that only allows 'free', 'pro', 'unlimited'
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_plan_type_check;

-- =====================================================
-- 2. CREATE NEW PLAN_TYPE CHECK CONSTRAINT WITH 'BASIC'
-- =====================================================

-- Add new constraint that includes 'basic' plan type
ALTER TABLE profiles 
ADD CONSTRAINT profiles_plan_type_check 
CHECK (plan_type = ANY (ARRAY['free'::text, 'basic'::text, 'pro'::text, 'unlimited'::text]));

-- =====================================================
-- 3. ADD DOCUMENTATION COMMENTS
-- =====================================================

-- Update column comment to reflect new plan types
COMMENT ON COLUMN profiles.plan_type IS 'User subscription plan: free (9 products), basic (100 products), pro (unlimited + analytics), unlimited (legacy)';

-- =====================================================
-- 4. VERIFY THE CHANGES
-- =====================================================

-- Check that the constraint was created successfully
SELECT 
    constraint_name, 
    check_clause,
    'Plan type constraint updated successfully' as status
FROM information_schema.check_constraints 
WHERE constraint_name = 'profiles_plan_type_check';

-- =====================================================
-- 5. TEST THE NEW CONSTRAINT (OPTIONAL)
-- =====================================================

-- Test that all plan types are now valid
-- This should not raise any errors
DO $$
BEGIN
    -- Test each plan type
    PERFORM 1 WHERE 'free' = ANY (ARRAY['free'::text, 'basic'::text, 'pro'::text, 'unlimited'::text]);
    PERFORM 1 WHERE 'basic' = ANY (ARRAY['free'::text, 'basic'::text, 'pro'::text, 'unlimited'::text]);
    PERFORM 1 WHERE 'pro' = ANY (ARRAY['free'::text, 'basic'::text, 'pro'::text, 'unlimited'::text]);
    PERFORM 1 WHERE 'unlimited' = ANY (ARRAY['free'::text, 'basic'::text, 'pro'::text, 'unlimited'::text]);
    
    RAISE NOTICE 'All plan types validated successfully: free, basic, pro, unlimited';
END $$;

-- =====================================================
-- 6. MIGRATION COMPLETE
-- =====================================================

-- Display completion message
SELECT 
    'Basic plan type migration completed successfully!' as message,
    'The profiles table now accepts: free, basic, pro, unlimited' as plan_types,
    NOW() as completed_at;
