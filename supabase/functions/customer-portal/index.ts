const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
    // Get user from auth header
    const authHeader = req.headers.get('authorization')
    
    // Require auth for customer portal
    let user = null
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(token)
      
      if (!authError && authUser) {
        user = authUser
      }
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required for customer portal' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
})