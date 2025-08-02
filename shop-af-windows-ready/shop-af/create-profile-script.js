// Run this in the browser console to create a profile manually
// Make sure you're signed in first

async function createProfileManually() {
  try {
    console.log('Starting manual profile creation...');
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return;
    }
    
    if (!user) {
      console.error('No user found. Please sign in first.');
      return;
    }
    
    console.log('User found:', user.id, user.email);
    
    // Create profile
    const newProfile = {
      user_id: user.id,
      username: `user${Math.floor(Math.random() * 1000)}`,
      display_name: user.email?.split('@')[0] || 'User',
      bio: null,
      avatar_url: null,
      primary_color: '#3B82F6',
      subscription_status: 'free',
      plan_type: 'free',
      product_count: 0,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Creating profile:', newProfile);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      return;
    }
    
    console.log('Profile created successfully!', data);
    console.log('Now refresh the page and try accessing your dashboard.');
    
    return data;
  } catch (err) {
    console.error('Exception:', err);
  }
}

// Run the function
createProfileManually();
