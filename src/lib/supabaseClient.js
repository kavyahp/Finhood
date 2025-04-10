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
    detectSessionInUrl: false,
    flowType: 'pkce', // Use PKCE flow for better security
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'Accept': 'application/json'
    },
    fetch: async (...args) => {
      try {
        const response = await fetch(...args);
        if (!response.ok) {
          // Handle common error cases
          if (response.status === 401) {
            // Token expired or invalid
            const error = new Error('Session expired. Please log in again.');
            error.code = 'session_expired';
            throw error;
          }
          
          const error = new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
          error.response = response;
          throw error;
        }
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        if (error.code === 'session_expired') {
          // Clear local storage and redirect to login
          localStorage.removeItem('supabase.auth.token');
          window.location.href = '/login';
        }
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
    
    // If session exists but is expired, handle it
    if (session && session.expires_at && session.expires_at < Date.now() / 1000) {
      console.log('Session expired, clearing token');
      localStorage.removeItem('supabase.auth.token');
      return null;
    }
    
    console.log('Supabase initialized successfully:', { isAuthenticated: !!session });
    return session;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return null;
  }
};

// Initialize when the module loads
initializeSupabase().catch(console.error);
