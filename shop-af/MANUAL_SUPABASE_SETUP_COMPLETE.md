# 🔧 Manual Supabase Setup - Complete Guide

## 🚨 **IMMEDIATE SETUP REQUIRED**

Since the Management API doesn't support direct Edge Function deployment, here's the complete manual setup guide for your Affiliate-Gate project.

## 📋 **Step 1: Set Environment Variables**

### **Go to Supabase Dashboard:**
1. **Visit**: https://supabase.com/dashboard
2. **Select**: Affiliate-Gate project (eyafgfuxvarbpkhjkuxq)
3. **Navigate**: Settings → Edge Functions → Environment Variables
4. **Click**: "Add Variable" for each of these:

```bash
Variable 1:
Name: STRIPE_SECRET_KEY
Value: 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

Variable 2:
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx

Variable 3:
Name: STRIPE_PRICE_PRO_MONTHLY
Value: price_1Rrki6DGBbR8XeGsrr4iz7TY

Variable 4:
Name: SITE_URL
Value: https://alleylink.com
```

## 🚀 **Step 2: Create Edge Functions**

### **Go to Edge Functions:**
1. **Navigate**: Edge Functions in your Supabase Dashboard
2. **Create 3 new functions** with these exact names and code:

---

### **Function 1: create-subscription**

**Name**: `create-subscription`

**Code**:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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

    if (profile.is_admin) {
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

    if (profile.subscription_status === 'active' && profile.plan_type === 'pro') {
      return new Response(
        JSON.stringify({ 
          data: { 
            alreadySubscribed: true,
            message: 'User already has an active subscription'
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

      await supabaseClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: Deno.env.get('STRIPE_PRICE_PRO_MONTHLY'),
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

---

### **Function 2: customer-portal**

**Name**: `customer-portal`

**Code**:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !profile.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: 'No Stripe customer found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${Deno.env.get('SITE_URL') || 'https://alleylink.com'}/dashboard`,
    })

    return new Response(
      JSON.stringify({ 
        data: { 
          portalUrl: session.url
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Customer portal error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

### **Function 3: stripe-webhook**

**Name**: `stripe-webhook`

**Code**: *Copy from the next message due to length limits*

## ✅ **Step 3: Deploy Functions**

After creating each function:
1. **Click "Deploy"** for each function
2. **Wait for deployment** to complete
3. **Verify** all 3 functions show as "Active"

## 🧪 **Step 4: Test**

1. **Refresh your browser**
2. **Go to pricing page**
3. **Click "Upgrade to Pro"**
4. **Should redirect to Stripe checkout**
5. **No more CORS errors!**

**This will fix your payment integration immediately!**
