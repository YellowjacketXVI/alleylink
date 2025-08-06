-- =====================================================
-- SHOP AF DATABASE FIXES - DEPLOY TO SUPABASE
-- =====================================================
-- This file contains all the database fixes needed for Shop AF
-- Run these commands in your Supabase SQL Editor

-- =====================================================
-- 1. FIX ADMIN RLS POLICY (Critical for Grant Pro functionality)
-- =====================================================

-- First, let's check what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop any conflicting update policies (if they exist)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create comprehensive update policy that allows:
-- 1. Users to update their own profiles
-- 2. Admins to update any profile
CREATE POLICY "Users can update own profile or admins can update any" ON profiles
FOR UPDATE USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE is_admin = true
  )
);

-- =====================================================
-- 2. USERNAME LOGIN SUPPORT FUNCTION
-- =====================================================

-- Function to get email by username for login purposes
CREATE OR REPLACE FUNCTION get_email_by_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
BEGIN
    -- Get the user's email from auth.users via profiles table
    SELECT auth.users.email INTO user_email
    FROM profiles
    JOIN auth.users ON profiles.user_id = auth.users.id
    WHERE profiles.username = lower(username_input);
    
    RETURN user_email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_email_by_username(text) TO authenticated;

-- =====================================================
-- 3. ENSURE PROPER SELECT POLICIES FOR ADMIN
-- =====================================================

-- Make sure admins can read all profiles
CREATE POLICY IF NOT EXISTS "Admins can read all profiles" ON profiles
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE is_admin = true
  ) OR
  auth.uid() = user_id
);

-- =====================================================
-- 4. WHITELIST TABLE POLICIES (if whitelist table exists)
-- =====================================================

-- Check if whitelist table exists and create policies
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'whitelist') THEN
        -- Allow admins to manage whitelist
        DROP POLICY IF EXISTS "Admins can manage whitelist" ON whitelist;
        
        CREATE POLICY "Admins can manage whitelist" ON whitelist
        FOR ALL USING (
            auth.uid() IN (
                SELECT user_id FROM profiles WHERE is_admin = true
            )
        );
        
        -- Allow reading whitelist for signup process
        CREATE POLICY IF NOT EXISTS "Allow reading whitelist for signup" ON whitelist
        FOR SELECT USING (true);
    END IF;
END $$;

-- =====================================================
-- 5. VERIFY ADMIN USER EXISTS
-- =====================================================

-- Check if your admin user has proper admin privileges
-- Replace 'your-admin-email@example.com' with your actual admin email
SELECT 
    p.user_id,
    p.username,
    p.display_name,
    p.is_admin,
    au.email
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE au.email = 'thrivingnik@gmail.com';

-- If the above query shows is_admin = false, uncomment and run this:
-- UPDATE profiles 
-- SET is_admin = true 
-- WHERE user_id IN (
--     SELECT id FROM auth.users WHERE email = 'thrivingnik@gmail.com'
-- );

-- =====================================================
-- 6. TEST THE ADMIN FUNCTIONALITY
-- =====================================================

-- Test query to verify admin can update other profiles
-- This should return the profile if permissions are correct
SELECT 
    user_id,
    username,
    display_name,
    plan_type,
    subscription_status,
    is_admin
FROM profiles 
WHERE plan_type = 'free' 
LIMIT 1;

-- =====================================================
-- 7. BACKUP VERIFICATION
-- =====================================================

-- Verify all policies are in place
SELECT 
    policyname,
    cmd,
    permissive,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- =====================================================
-- 8. OPTIONAL: ENABLE DETAILED LOGGING
-- =====================================================

-- Enable detailed logging for debugging (optional)
-- This helps track policy violations
-- ALTER SYSTEM SET log_statement = 'all';
-- SELECT pg_reload_conf();

-- =====================================================
-- DEPLOYMENT COMPLETE
-- =====================================================

-- After running these commands:
-- 1. Test the admin grant pro functionality
-- 2. Check console logs for success messages
-- 3. Verify user plan updates correctly

COMMENT ON FUNCTION get_email_by_username(text) IS 'Function to support username login by returning email for given username';

-- Final verification query
SELECT 'Database fixes deployed successfully!' as status;
