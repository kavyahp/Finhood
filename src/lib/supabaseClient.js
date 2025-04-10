import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const createSupabaseClient = async () => {
  const { getToken } = useAuth();
  const token = await getToken({ template: 'supabase' });

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

// Default client for unauthenticated requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
