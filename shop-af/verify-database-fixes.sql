-- =====================================================
-- VERIFICATION SCRIPT - Run after deploying database fixes
-- =====================================================
-- Run this in Supabase SQL Editor to verify all fixes are working

-- =====================================================
-- 1. VERIFY RLS POLICIES
-- =====================================================

SELECT 
    '=== RLS POLICIES VERIFICATION ===' as section;

-- Check all policies on profiles table
SELECT 
    policyname,
    cmd as command,
    permissive,
    CASE 
        WHEN policyname LIKE '%admin%' THEN '✅ Admin Policy'
        WHEN policyname LIKE '%own%' THEN '✅ User Policy'
        ELSE '⚠️ Other Policy'
    END as policy_type
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- =====================================================
-- 2. VERIFY ADMIN USER
-- =====================================================

SELECT 
    '=== ADMIN USER VERIFICATION ===' as section;

-- Check admin user status
SELECT 
    p.user_id,
    p.username,
    p.display_name,
    p.is_admin,
    au.email,
    CASE 
        WHEN p.is_admin = true THEN '✅ Admin Access Granted'
        ELSE '❌ Admin Access Missing'
    END as admin_status
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE au.email = 'thrivingnik@gmail.com';

-- =====================================================
-- 3. VERIFY USERNAME LOGIN FUNCTION
-- =====================================================

SELECT 
    '=== USERNAME LOGIN FUNCTION VERIFICATION ===' as section;

-- Check if function exists
SELECT 
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name = 'get_email_by_username' THEN '✅ Function Exists'
        ELSE '❌ Function Missing'
    END as function_status
FROM information_schema.routines 
WHERE routine_name = 'get_email_by_username';

-- Test the function with a known username
SELECT 
    'Testing username function...' as test,
    get_email_by_username('testuser123') as result_email,
    CASE 
        WHEN get_email_by_username('testuser123') IS NOT NULL THEN '✅ Function Working'
        ELSE '⚠️ Function Returns NULL'
    END as function_test;

-- =====================================================
-- 4. VERIFY TEST USERS FOR GRANT PRO
-- =====================================================

SELECT 
    '=== TEST USERS FOR GRANT PRO ===' as section;

-- Find users with free plans that can be used for testing
SELECT 
    user_id,
    username,
    display_name,
    plan_type,
    subscription_status,
    CASE 
        WHEN plan_type = 'free' THEN '✅ Available for Pro Grant Test'
        ELSE '⚠️ Already Pro/Unlimited'
    END as test_status
FROM profiles 
WHERE plan_type = 'free'
LIMIT 5;

-- =====================================================
-- 5. VERIFY WHITELIST TABLE (if exists)
-- =====================================================

SELECT 
    '=== WHITELIST TABLE VERIFICATION ===' as section;

-- Check if whitelist table exists and has policies
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'whitelist') 
        THEN '✅ Whitelist Table Exists'
        ELSE '⚠️ Whitelist Table Not Found'
    END as whitelist_status;

-- Check whitelist policies (if table exists)
SELECT 
    policyname,
    cmd as command,
    CASE 
        WHEN policyname LIKE '%admin%' THEN '✅ Admin Whitelist Policy'
        WHEN policyname LIKE '%signup%' THEN '✅ Signup Policy'
        ELSE '⚠️ Other Policy'
    END as policy_type
FROM pg_policies 
WHERE tablename = 'whitelist';

-- =====================================================
-- 6. OVERALL SYSTEM STATUS
-- =====================================================

SELECT 
    '=== OVERALL SYSTEM STATUS ===' as section;

-- Summary of all checks
WITH status_checks AS (
    SELECT 
        CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END as has_admin_policies
    FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname LIKE '%admin%'
    
    UNION ALL
    
    SELECT 
        CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END as has_username_function
    FROM information_schema.routines 
    WHERE routine_name = 'get_email_by_username'
    
    UNION ALL
    
    SELECT 
        CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END as has_admin_user
    FROM profiles p
    JOIN auth.users au ON p.user_id = au.id
    WHERE au.email = 'thrivingnik@gmail.com' AND p.is_admin = true
)
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM status_checks WHERE has_admin_policies = 1) > 0 
        THEN '✅ Admin Policies: OK'
        ELSE '❌ Admin Policies: MISSING'
    END as admin_policies_status,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM status_checks WHERE has_username_function = 1) > 0 
        THEN '✅ Username Function: OK'
        ELSE '❌ Username Function: MISSING'
    END as username_function_status,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM status_checks WHERE has_admin_user = 1) > 0 
        THEN '✅ Admin User: OK'
        ELSE '❌ Admin User: MISSING'
    END as admin_user_status;

-- =====================================================
-- 7. NEXT STEPS
-- =====================================================

SELECT 
    '=== NEXT STEPS ===' as section;

SELECT 
    'If all checks show ✅, you can now:' as instruction
UNION ALL
SELECT '1. Test admin grant pro functionality'
UNION ALL
SELECT '2. Test username login (if implemented)'
UNION ALL
SELECT '3. Verify no console errors'
UNION ALL
SELECT '4. Check user plan updates correctly';

-- =====================================================
-- VERIFICATION COMPLETE
-- =====================================================

SELECT 
    '🎉 DATABASE VERIFICATION COMPLETE!' as final_status,
    NOW() as verification_time;
