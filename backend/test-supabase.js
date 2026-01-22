import { supabase } from './src/config/supabase.js';

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase error:', error);
    } else {
      console.log('✅ Supabase connected successfully');
    }
    
    // Test 2: Auth signup
    console.log('\nTesting auth signup...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'testuser@example.com',
      password: 'testpassword123',
      options: {
        data: {
          full_name: 'Test User',
          role: 'user'
        }
      }
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError.message);
    } else {
      console.log('✅ Auth signup successful:', authData.user?.email);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testSupabase();
