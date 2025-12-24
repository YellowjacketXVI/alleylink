import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://eyafgfuxvarbpkhjkuxq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWZnZnV4dmFyYnBraGprdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNTI5NzksImV4cCI6MjA2ODcyODk3OX0.3TcVpxX3XeuL_WtMNsitvKFP1-DI3gFzdZkTYJ7BSQQ'
);

async function runMigrations() {
  console.log('🚀 Running database migrations...\n');
  
  try {
    // 1. Create increment_click_count function
    console.log('1. Creating increment_click_count function...');
    
    const incrementFunctionSQL = `
      CREATE OR REPLACE FUNCTION increment_click_count(product_id INTEGER)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        UPDATE products 
        SET 
          click_count = click_count + 1,
          updated_at = NOW()
        WHERE id = product_id;
      END;
      $$;

      -- Grant execute permission to authenticated users
      GRANT EXECUTE ON FUNCTION increment_click_count(INTEGER) TO authenticated;
      GRANT EXECUTE ON FUNCTION increment_click_count(INTEGER) TO anon;
    `;
    
    const { error: functionError } = await supabase.rpc('exec_sql', { sql: incrementFunctionSQL });
    
    if (functionError) {
      console.log('❌ Function creation failed:', functionError.message);
      
      // Try alternative approach - direct SQL execution
      console.log('Trying alternative approach...');
      const { data, error } = await supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1);
        
      console.log('Migration table access:', error ? error.message : 'accessible');
    } else {
      console.log('✅ increment_click_count function created');
    }
    
    // 2. Test the function
    console.log('\n2. Testing increment_click_count function...');
    const { data: testData, error: testError } = await supabase
      .rpc('increment_click_count', { product_id: 2 });
      
    if (testError) {
      console.log('❌ Function test failed:', testError.message);
    } else {
      console.log('✅ Function test passed');
    }
    
    // 3. Check if analytics tables have proper permissions
    console.log('\n3. Testing analytics table permissions...');
    
    // Test inserting into click_analytics
    const { data: clickInsert, error: clickInsertError } = await supabase
      .from('click_analytics')
      .insert({
        product_id: 2,
        user_id: null,
        ip_address: '127.0.0.1',
        user_agent: 'test',
        referrer: 'test'
      });
      
    if (clickInsertError) {
      console.log('❌ Click analytics insert failed:', clickInsertError.message);
    } else {
      console.log('✅ Click analytics insert successful');
    }
    
    // Test inserting into profile_view_analytics
    const { data: profileInsert, error: profileInsertError } = await supabase
      .from('profile_view_analytics')
      .insert({
        profile_user_id: '6bcefc5f-9984-47d4-b51b-ecce7876617e',
        viewer_user_id: null,
        ip_address: '127.0.0.1',
        user_agent: 'test',
        referrer: 'test'
      });
      
    if (profileInsertError) {
      console.log('❌ Profile view analytics insert failed:', profileInsertError.message);
    } else {
      console.log('✅ Profile view analytics insert successful');
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  }
}

runMigrations();