const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
    // Get viewer user ID from auth header if available
    const authHeader = req.headers.get('authorization')
    let viewerUserId = null
    
    // Make auth optional for profile view tracking (anonymous users can view)
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
        if (!authError && user) {
          viewerUserId = user.id
        }
      } catch (error) {
        console.log('Auth error (non-critical):', error)
      }
    }
})