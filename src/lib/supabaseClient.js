import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verify environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not set');
}

// Create a single instance of the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Accept': 'application/json'
    },
    fetch: async (...args) => {
      try {
        const response = await fetch(...args);
        if (!response.ok) {
          const error = new Error('Network response was not ok');
          error.response = response;
          throw error;
        }
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    }
  }
});

// Initialize the client and test connection
export const initializeSupabase = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('Supabase initialized successfully:', { isAuthenticated: !!session });
    return session;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  }
};

// Initialize when the module loads
initializeSupabase().catch(console.error);
