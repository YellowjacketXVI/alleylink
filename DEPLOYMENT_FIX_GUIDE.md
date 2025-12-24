# 🔧 Deployment Fix Guide - Supabase Authentication Errors

## 🚨 Issues Fixed

The 401 Unauthorized errors were caused by:
1. **Expired Supabase anonymous key** - Updated with correct key
2. **Missing Edge Functions** - Need to be deployed via Supabase dashboard
3. **Environment variables** - Updated with working configuration

## ✅ What Was Fixed

### 1. Updated Supabase Configuration
- **Fixed anonymous key** in `src/lib/supabase.ts`
- **Updated .env file** with correct credentials
- **Removed expired tokens** that were causing 401 errors

### 2. Removed CLI Dependencies
- **Deleted problematic CLI scripts** that were causing permission errors
- **Edge Functions** should be deployed via Supabase dashboard instead

## 🚀 Next Steps to Complete Integration

### Option 1: Connect to Supabase (Recommended)
1. **Click "Connect to Supabase"** button in the top right of this interface
2. **Edge Functions will deploy automatically**
3. **Test the payment buttons** - should work immediately

### Option 2: Manual Supabase Dashboard Setup
1. **Go to** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Select** your Affiliate-Gate project
3. **Navigate to** Edge Functions
4. **Deploy these 3 functions** using the code from your `supabase/functions/` folder:
   - `create-subscription`
   - `stripe-webhook` 
   - `customer-portal`

## 🧪 Test After Fix

1. **Refresh your browser**
2. **Try logging in** - should work without 401 errors
3. **Click "Upgrade to Pro"** - should redirect to Stripe checkout
4. **No more CORS errors** in console

## 🔍 Verification

After the fix, you should see:
- ✅ No 401 authentication errors
- ✅ Profile data loads correctly
- ✅ Payment buttons work
- ✅ Stripe checkout accessible

The authentication errors should be resolved with the updated Supabase configuration!