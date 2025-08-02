# 🚀 Database Fixes Deployment Guide

## 🎯 Purpose
Deploy the database fixes to resolve the admin grant pro functionality and enable username login support.

## 🔧 Issues Being Fixed
1. **Admin Grant Pro**: RLS policy blocking admin updates
2. **Username Login**: Missing function for username-to-email lookup
3. **Admin Permissions**: Ensure proper admin access to all profiles

## 📋 Deployment Steps

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New Query"** to create a new SQL script

### Step 2: Deploy the Database Fixes
1. Copy the entire contents of `database-fixes.sql`
2. Paste it into the Supabase SQL Editor
3. Click **"Run"** to execute all the fixes

### Step 3: Verify Admin User
The script will check if your admin user (`thrivingnik@gmail.com`) has admin privileges.

**If the query shows `is_admin = false`:**
1. Uncomment this line in the SQL script:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'thrivingnik@gmail.com'
);
```
2. Run the script again

### Step 4: Verify Deployment Success
After running the script, you should see:
- ✅ "Database fixes deployed successfully!" message
- ✅ New policies created
- ✅ Function `get_email_by_username` created
- ✅ Admin user has proper privileges

## 🧪 Test the Fixes

### Test 1: Admin Grant Pro
1. Go to your admin page: `https://alleylink.com/admin`
2. Find a user with "Free" plan
3. Click "Grant Pro"
4. Watch console logs - should see success messages

### Test 2: Username Login (after deployment)
1. Go to login page: `https://alleylink.com/login`
2. Try logging in with a username instead of email
3. Should work without errors

## 🔍 Troubleshooting

### Issue: "Permission denied" errors
**Solution**: Re-run the RLS policy creation commands

### Issue: Function already exists
**Solution**: The script uses `CREATE OR REPLACE` so this is normal

### Issue: Admin user still can't update profiles
**Solution**: 
1. Check if admin user has `is_admin = true`
2. Verify the RLS policies were created correctly
3. Try logging out and back in

## 📊 Expected Results

### Before Fix:
```
❌ No data returned from update operation
❌ Error granting Pro access: Update operation returned no data
```

### After Fix:
```
✅ Pro access granted successfully!
📊 Updated user data: {plan_type: "pro", subscription_status: "active"}
📊 New plan: pro New status: active
```

## 🔒 Security Notes

The new RLS policies ensure:
- ✅ Users can only update their own profiles
- ✅ Admin users can update any profile
- ✅ Non-admin users cannot update other profiles
- ✅ Proper authentication is required for all operations

## 🆘 If Something Goes Wrong

### Rollback Plan
If you need to rollback the changes:

```sql
-- Remove the new policies
DROP POLICY IF EXISTS "Users can update own profile or admins can update any" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Remove the function
DROP FUNCTION IF EXISTS get_email_by_username(text);

-- Recreate basic user update policy
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = user_id);
```

### Get Help
If you encounter issues:
1. Copy the exact error message from Supabase
2. Check the Supabase logs for more details
3. Verify your admin user email is correct in the script

## ✅ Success Checklist

After deployment, verify:
- [ ] SQL script ran without errors
- [ ] Admin user has `is_admin = true`
- [ ] Can grant pro access to users
- [ ] Username login works (if testing)
- [ ] No permission errors in console
- [ ] User plans update correctly

---

**Ready to deploy? Copy `database-fixes.sql` into Supabase SQL Editor and run it!**
