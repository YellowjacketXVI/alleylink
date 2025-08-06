@@ .. @@
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
+  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
 }
 
 serve(async (req) => {
@@ .. @@
     // Get user ID from auth header if available
     const authHeader = req.headers.get('authorization')
     let userId = null
     
+    // Make auth optional for click tracking (anonymous users can click)
     if (authHeader) {
       try {
         const token = authHeader.replace('Bearer ', '')
-        const { data: { user } } = await supabaseClient.auth.getUser(token)
-        userId = user?.id || null
+        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
+        if (!authError && user) {
+          userId = user.id
+        }
       } catch (error) {
         console.log('Auth error (non-critical):', error)
       }
     }
})