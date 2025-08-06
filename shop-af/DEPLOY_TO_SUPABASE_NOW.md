# 🚀 Deploy Edge Functions to Supabase - IMMEDIATE FIX

## 🚨 **URGENT: Fix CORS Errors by Deploying Edge Functions**

The payment buttons are failing because the Edge Functions don't exist in your Supabase project yet. Here's how to fix it immediately:

## 🔧 **Method 1: Supabase CLI (Recommended - 5 minutes)**

### **Step 1: Install Supabase CLI**
```bash
# Install globally
npm install -g supabase
```

### **Step 2: Login and Link Project**
```bash
# Login to Supabase
supabase login

# Link to your specific project
supabase link --project-ref eyafgfuxvarbpkhjkuxq
```

### **Step 3: Set Environment Variables**
```bash
# Set all required environment variables
supabase secrets set STRIPE_SECRET_KEY=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

supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx

supabase secrets set STRIPE_PRICE_PRO_MONTHLY=price_1Rrki6DGBbR8XeGsrr4iz7TY

supabase secrets set SITE_URL=https://alleylink.com
```

### **Step 4: Deploy Edge Functions**
```bash
# Deploy all 3 functions
supabase functions deploy create-subscription
supabase functions deploy stripe-webhook
supabase functions deploy customer-portal
```

## 🔧 **Method 2: Supabase Dashboard (Manual - 10 minutes)**

### **Step 1: Go to Supabase Dashboard**
1. **Visit**: https://supabase.com/dashboard
2. **Select**: Affiliate-Gate project
3. **Navigate to**: Edge Functions

### **Step 2: Set Environment Variables**
1. **Go to**: Settings → Edge Functions → Environment Variables
2. **Add these 4 variables:**

```
Name: STRIPE_SECRET_KEY
Value: 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

Name: STRIPE_WEBHOOK_SECRET
Value: whsec_UCPCGwKWnGtrPU4l0UEB8A1QBYndzUAx

Name: STRIPE_PRICE_PRO_MONTHLY
Value: price_1Rrki6DGBbR8XeGsrr4iz7TY

Name: SITE_URL
Value: https://alleylink.com
```

### **Step 3: Create Edge Functions**
**Create 3 functions with these exact names:**

#### **Function 1: create-subscription**
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

#### **Function 2: stripe-webhook**
*Copy the code from `supabase/functions/stripe-webhook/index.ts`*

#### **Function 3: customer-portal**
*Copy the code from `supabase/functions/customer-portal/index.ts`*

## ✅ **After Deployment:**

1. **Refresh your browser**
2. **Click "Upgrade to Pro"** on pricing page
3. **Should redirect to Stripe checkout**
4. **Test with card**: `4242 4242 4242 4242`

## 🔍 **Verify Deployment:**

### **Check Functions Exist:**
- Go to Supabase Dashboard → Edge Functions
- Should see 3 functions: create-subscription, stripe-webhook, customer-portal

### **Test Function URLs:**
```
https://eyafgfuxvarbpkhjkuxq.supabase.co/functions/v1/create-subscription
https://eyafgfuxvarbpkhjkuxq.supabase.co/functions/v1/stripe-webhook
https://eyafgfuxvarbpkhjkuxq.supabase.co/functions/v1/customer-portal
```

## 🚨 **This Will Fix:**

- ✅ CORS errors on payment buttons
- ✅ "Upgrade to Pro" functionality
- ✅ Stripe checkout integration
- ✅ Subscription management
- ✅ Webhook processing

**Deploy these functions now and your payment system will work immediately!**
