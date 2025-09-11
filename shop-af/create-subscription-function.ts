// Copy this code into Supabase Dashboard → Edge Functions → create-subscription

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

    // Check if user already has an active subscription
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

    // Create Stripe Checkout Session
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
