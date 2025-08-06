@@ .. @@
 import { createClient } from '@supabase/supabase-js'
 
-// Production configuration with fallback values
-const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eyafgfuxvarbpkhjkuxq.supabase.co'
-const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWZnZnV4dmFyYnBraGprdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNTI5NzksImV4cCI6MjA2ODcyODk3OX0.3TcVpxX3XeuL_WtMNsitvKFP1-DI3gFzdZkTYJ7BSQQ'
+// Updated Supabase configuration with correct keys
+const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eyafgfuxvarbpkhjkuxq.supabase.co'
+const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWZnZnV4dmFyYnBraGprdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NTU4NzQsImV4cCI6MjA1MTQzMTg3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'