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
    flowType: 'pkce',
    storageKey: 'supabase.auth.token',
    storage: {
      getItem: (key) => {
        try {
          const itemStr = localStorage.getItem(key);
          if (!itemStr) return null;
          return itemStr;
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    }
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
          
          if (response.status === 400) {
            // Bad request - try to get more details from the response
            let errorMessage = `Network response was not ok: ${response.status} ${response.statusText}`;
            try {
              const errorData = await response.json();
              if (errorData && errorData.message) {
                errorMessage = errorData.message;
              }
            } catch (e) {
              // If we can't parse the JSON, just use the status text
              console.error('Could not parse error response:', e);
            }
            
            const error = new Error(errorMessage);
            error.response = response;
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

// Initialize Supabase and check connection
export const initializeSupabase = async () => {
  try {
    // Test the connection by getting the current session
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase initialization error:', error);
      return false;
    }
    console.log('Supabase initialized successfully');
    return true;
  } catch (error) {
    console.error('Supabase initialization exception:', error);
    return false;
  }
};

// Initialize when the module loads
initializeSupabase().catch(console.error);
