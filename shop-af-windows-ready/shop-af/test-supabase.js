// Quick test to verify Supabase connection
import { supabase } from './src/lib/supabase.js'

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('username, display_name')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('Supabase connection successful!')
    console.log('Sample data:', data)
    return true
  } catch (err) {
    console.error('Connection test failed:', err)
    return false
  }
}

testSupabaseConnection()
