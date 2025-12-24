import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eyafgfuxvarbpkhjkuxq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWZnZnV4dmFyYnBraGprdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNTI5NzksImV4cCI6MjA2ODcyODk3OX0.3TcVpxX3XeuL_WtMNsitvKFP1-DI3gFzdZkTYJ7BSQQ'
);

async function debugAnalytics() {
  console.log('🔍 Debugging Analytics System...\n');
  
  try {
    // 1. Check if analytics tables exist
    console.log('1. Checking analytics tables...');
    
    const { data: clickData, error: clickError } = await supabase
      .from('click_analytics')
      .select('*')
      .limit(5);
      
    if (clickError) {
      console.log('❌ click_analytics table:', clickError.message);
    } else {
      console.log('✅ click_analytics table exists');
      console.log('   Records found:', clickData.length);
      if (clickData.length > 0) {
        console.log('   Sample record:', JSON.stringify(clickData[0], null, 2));
      }
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('profile_view_analytics')
      .select('*')
      .limit(5);
      
    if (profileError) {
      console.log('❌ profile_view_analytics table:', profileError.message);
    } else {
      console.log('✅ profile_view_analytics table exists');
      console.log('   Records found:', profileData.length);
      if (profileData.length > 0) {
        console.log('   Sample record:', JSON.stringify(profileData[0], null, 2));
      }
    }
    
    // 2. Test edge functions
    console.log('\n2. Testing edge functions...');
    
    // Test track-click
    const { data: trackClickData, error: trackClickError } = await supabase.functions.invoke('track-click', {
      body: { productId: 1, affiliateUrl: 'https://example.com' }
    });
    
    if (trackClickError) {
      console.log('❌ track-click function:', trackClickError.message);
    } else {
      console.log('✅ track-click function working');
      console.log('   Response:', JSON.stringify(trackClickData, null, 2));
    }
    
    // Test track-profile-view
    const { data: trackProfileData, error: trackProfileError } = await supabase.functions.invoke('track-profile-view', {
      body: { profileUserId: 'test-user-id-123' }
    });
    
    if (trackProfileError) {
      console.log('❌ track-profile-view function:', trackProfileError.message);
    } else {
      console.log('✅ track-profile-view function working');
      console.log('   Response:', JSON.stringify(trackProfileData, null, 2));
    }
    
    // 3. Check products table
    console.log('\n3. Checking products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, user_id, is_active, click_count')
      .eq('is_active', true)
      .limit(5);
      
    if (productsError) {
      console.log('❌ products table:', productsError.message);
    } else {
      console.log('✅ products table exists');
      console.log('   Active products found:', products.length);
      if (products.length > 0) {
        console.log('   Sample product:', JSON.stringify(products[0], null, 2));
      }
    }
    
    // 4. Check increment function
    console.log('\n4. Testing increment_click_count function...');
    if (products && products.length > 0) {
      const testProductId = products[0].id;
      const { data: incrementData, error: incrementError } = await supabase
        .rpc('increment_click_count', { product_id: testProductId });
        
      if (incrementError) {
        console.log('❌ increment_click_count function:', incrementError.message);
      } else {
        console.log('✅ increment_click_count function working');
      }
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugAnalytics();