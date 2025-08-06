import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
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
        JSON.stringify({ 
          success: true, 
          message: 'Own profile view not tracked' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
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
      // Don't fail the request if analytics insertion fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Profile view tracked successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Track profile view error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
