# 🚨 URGENT: Manual Edge Function Deployment Required

## 🎯 **Issue**
The Basic tier subscription is still creating Pro subscriptions because the Edge Function hasn't been updated with the Basic price ID fallback.

## 🔧 **Solution: Manual Deployment**

### **Step 1: Access Supabase Dashboard**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **Affiliate-Gate** (eyafgfuxvarbpkhjkuxq)
3. Navigate to **Edge Functions** in the sidebar

### **Step 2: Update create-subscription Function**
1. Click on the **create-subscription** function
2. Replace the entire code with the updated version below
3. Click **Deploy** or **Save**

### **Step 3: Updated Edge Function Code**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { planType } = await req.json()

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is whitelisted for free pro access
    if (profile.is_admin) {
      // Update profile to pro status
      await supabaseClient
        .from('profiles')
        .update({
          plan_type: 'pro',
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      return new Response(
        JSON.stringify({
          data: {
            whitelisted: true,
            message: 'Admin access granted'
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already has an active subscription for the requested plan
    if (profile.subscription_status === 'active' && profile.plan_type === planType) {
      return new Response(
        JSON.stringify({
          data: {
            alreadySubscribed: true,
            message: `User already has an active ${planType} subscription`
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Allow upgrading from basic to pro
    if (profile.subscription_status === 'active' && profile.plan_type === 'basic' && planType === 'pro') {
      // This will create a new subscription, Stripe will handle the upgrade
    }

    // Create or get Stripe customer
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
          username: profile.username
        }
      })
      customerId = customer.id

      // Update profile with customer ID
      await supabaseClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)
    }

    // 🔥 CRITICAL FIX: Get the correct price ID based on plan type with fallback
    const priceId = planType === 'basic'
      ? (Deno.env.get('STRIPE_PRICE_BASIC_MONTHLY') || 'price_1SB68VDGBbR8XeGs5EqAmqyu')
      : Deno.env.get('STRIPE_PRICE_PRO_MONTHLY')

    console.log('Creating subscription for planType:', planType, 'with priceId:', priceId)

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${Deno.env.get('SITE_URL') || 'https://alleylink.com'}/dashboard?success=true`,
      cancel_url: `${Deno.env.get('SITE_URL') || 'https://alleylink.com'}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_type: planType
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_type: planType
        },
      },
      allow_promotion_codes: true,
    })

    return new Response(
      JSON.stringify({
        data: {
          checkoutUrl: session.url,
          sessionId: session.id
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Create subscription error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

### **Step 4: Set Environment Variable (Optional)**
1. Go to **Settings** → **Edge Functions**
2. Add secret: 
   - **Name**: `STRIPE_PRICE_BASIC_MONTHLY`
   - **Value**: `price_1SB68VDGBbR8XeGs5EqAmqyu`

**Note**: The fallback price ID in the code will work even without this secret.

### **Step 5: Test the Fix**
1. Go to `http://localhost:5173/pricing`
2. Click "Upgrade to Basic"
3. Verify Stripe checkout shows $2.99/month Basic plan
4. Check browser console for debugging logs

## 🔍 **Key Changes Made**

### **Line 118-120 (Critical Fix)**
```typescript
// OLD (causing Pro subscriptions)
const priceId = planType === 'basic'
  ? Deno.env.get('STRIPE_PRICE_BASIC_MONTHLY')
  : Deno.env.get('STRIPE_PRICE_PRO_MONTHLY')

// NEW (with fallback)
const priceId = planType === 'basic'
  ? (Deno.env.get('STRIPE_PRICE_BASIC_MONTHLY') || 'price_1SB68VDGBbR8XeGs5EqAmqyu')
  : Deno.env.get('STRIPE_PRICE_PRO_MONTHLY')
```

### **Line 122 (Added Debugging)**
```typescript
console.log('Creating subscription for planType:', planType, 'with priceId:', priceId)
```

## ✅ **Expected Result After Deployment**

- ✅ Basic tier button creates Basic subscription ($2.99/month)
- ✅ Pro tier button creates Pro subscription ($4.99/month)
- ✅ Console logs show correct planType and priceId
- ✅ Stripe checkout displays correct pricing

## 🚨 **This Fix is URGENT**

Without this deployment, all Basic tier subscriptions will continue to create Pro subscriptions, causing billing issues and customer confusion.

**Please deploy this Edge Function update immediately!** 🔥
