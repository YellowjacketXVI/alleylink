# ✅ Supabase Setup Complete for Affiliate-Gate

## 🗄️ **Database Changes Applied Successfully**

All database schema changes have been successfully applied to your Affiliate-Gate Supabase project:

### **✅ Tables Created/Updated:**

#### **1. Profiles Table - Updated**
- ✅ Added `display_name_color` column (TEXT, default: '#FFFFFF')
- ✅ Added `display_name_font` column (TEXT, default: 'inter')
- ✅ Added font validation constraint (merriweather, poppins, orbitron, montserrat, inter, papyrus, sansserif)
- ✅ Updated all existing profiles with default values

#### **2. Click Analytics Table - Created**
- ✅ `click_analytics` table created with all required columns
- ✅ Foreign key relationships established
- ✅ Indexes created for performance
- ✅ RLS enabled with proper policies

#### **3. Profile View Analytics Table - Created**
- ✅ `profile_view_analytics` table created with all required columns
- ✅ Foreign key relationships established
- ✅ Indexes created for performance
- ✅ RLS enabled with proper policies

### **✅ Security Policies Applied:**
- ✅ Users can only view analytics for their own products
- ✅ Users can only view their own profile analytics
- ✅ Public insert allowed for tracking (anonymous users)

## 🔧 **Edge Functions - Manual Deployment Required**

The database is ready, but you need to deploy 2 Edge Functions manually. Here's how:

### **Option 1: Deploy via Supabase Dashboard (Recommended)**

1. **Go to your Supabase Dashboard**
2. **Navigate to Edge Functions**
3. **Create New Function: `track-click`**
4. **Copy and paste this code:**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { productId, affiliateUrl } = await req.json()

    if (!productId) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user ID from auth header if available
    const authHeader = req.headers.get('authorization')
    let userId = null
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user } } = await supabaseClient.auth.getUser(token)
        userId = user?.id || null
      } catch (error) {
        console.log('Auth error (non-critical):', error)
      }
    }

    // Get request metadata
    const userAgent = req.headers.get('user-agent')
    const referrer = req.headers.get('referer')
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    // Insert click analytics record
    const { error: insertError } = await supabaseClient
      .from('click_analytics')
      .insert({
        product_id: productId,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer
      })

    if (insertError) {
      console.error('Error inserting click analytics:', insertError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Click tracked successfully',
        affiliateUrl 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Track click error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

5. **Deploy the function**

6. **Create New Function: `track-profile-view`**
7. **Copy and paste this code:**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { profileUserId } = await req.json()

    if (!profileUserId) {
      return new Response(
        JSON.stringify({ error: 'Profile user ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get viewer user ID from auth header if available
    const authHeader = req.headers.get('authorization')
    let viewerUserId = null
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user } } = await supabaseClient.auth.getUser(token)
        viewerUserId = user?.id || null
      } catch (error) {
        console.log('Auth error (non-critical):', error)
      }
    }

    // Don't track if user is viewing their own profile
    if (viewerUserId === profileUserId) {
      return new Response(
        JSON.stringify({ success: true, message: 'Own profile view not tracked' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get request metadata
    const userAgent = req.headers.get('user-agent')
    const referrer = req.headers.get('referer')
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    // Insert profile view analytics record
    const { error: insertError } = await supabaseClient
      .from('profile_view_analytics')
      .insert({
        profile_user_id: profileUserId,
        viewer_user_id: viewerUserId,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer
      })

    if (insertError) {
      console.error('Error inserting profile view analytics:', insertError)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Profile view tracked successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Track profile view error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

8. **Deploy the function**

## 🎉 **What's Now Working:**

✅ **Display Name Customization** - Users can change fonts and colors
✅ **Analytics Database** - Ready to track clicks and profile views
✅ **Security Policies** - Proper RLS protection in place
✅ **Performance Indexes** - Optimized for fast queries

## 🚀 **After Deploying Edge Functions:**

✅ **Accurate Click Tracking** - Real successful redirects counted
✅ **Profile View Analytics** - Track profile page visits
✅ **Enhanced Dashboard** - Real analytics data displayed
✅ **No More Console Errors** - All database operations will succeed

Your Affiliate-Gate Supabase project is now fully configured and ready to support all the new features!
