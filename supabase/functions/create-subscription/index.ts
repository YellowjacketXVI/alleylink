@@ .. @@
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
+  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
 }
 
 serve(async (req) => {
@@ .. @@
     // Get user from auth header
     const authHeader = req.headers.get('authorization')
-    if (!authHeader) {
-      return new Response(
-        JSON.stringify({ error: 'No authorization header' }),
-        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
-      )
-    }
+    
+    // Allow requests without auth for public access
+    let user = null
+    if (authHeader) {
+      const token = authHeader.replace('Bearer ', '')
+      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(token)
+      
+      if (!authError && authUser) {
+        user = authUser
+      }
+    }
 
-    const token = authHeader.replace('Bearer ', '')
-    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
-
-    if (authError || !user) {
+    if (!user) {
       return new Response(
-        JSON.stringify({ error: 'Invalid token' }),
+        JSON.stringify({ error: 'Authentication required' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }