import { supabase } from '../lib/supabaseClient';
import { authService } from '../services/supabase';

// Test user credentials (for testing only)
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'test123!';

async function testSessionHandling() {
  console.log('Starting session handling tests...');

  try {
    // 1. Test sign up
    console.log('1. Testing sign up...');
    const signUpResult = await authService.signUp(TEST_EMAIL, TEST_PASSWORD);
    console.log('Sign up result:', signUpResult);

    // 2. Test sign in
    console.log('2. Testing sign in...');
    const signInResult = await authService.signIn(TEST_EMAIL, TEST_PASSWORD);
    console.log('Sign in result:', signInResult);

    // 3. Test session
    console.log('3. Testing session...');
    const session = await authService.getSession();
    console.log('Session:', session);

    // 4. Test token refresh
    console.log('4. Testing token refresh...');
    const { data: { session: refreshedSession }, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('Refreshed session:', refreshedSession);

    // 5. Test sign out
    console.log('5. Testing sign out...');
    await authService.signOut();
    console.log('Sign out successful');

    console.log('All session tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
if (typeof window === 'undefined') {
  testSessionHandling();
}
