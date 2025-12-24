import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Optional auth (viewer may be anonymous)
    let viewerUserId: string | null = null
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseClient.auth.getUser(token)
      viewerUserId = user?.id ?? null
    }

    const { productId } = await req.json()
    if (!productId) {
      return new Response(JSON.stringify({ error: 'Missing productId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null
    const userAgent = req.headers.get('user-agent') || null
    const referrer = req.headers.get('referer') || null

    const { error } = await supabaseClient
      .from('click_analytics')
      .insert([
        {
          product_id: productId,
          user_id: viewerUserId,
          clicked_at: new Date().toISOString(),
          ip_address: ip,
          user_agent: userAgent,
          referrer: referrer,
        }
      ])

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ data: { ok: true } }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('track-click error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})