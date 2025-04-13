import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'TOKEN_REFRESHED') {
        // Token was refreshed successfully
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        // Clear any stored session data
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, metadata }) => {
    try {
      console.log('AuthContext: Attempting to sign up user with email:', email);

      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        console.error('AuthContext: Signup error from Supabase:', error);
        throw error;
      }

      console.log('AuthContext: Signup successful:', data);
      return { data, error: null };
    } catch (error) {
      console.error('AuthContext: Signup exception:', error);
      return { data: null, error };
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // First clear local storage to prevent future auth issues
      localStorage.removeItem('supabase.auth.token');

      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();

      // Even if there's an error, we want to clear the local state
      setSession(null);
      setUser(null);

      // If there was an error but it's a 403, we can ignore it as the session is already invalid
      if (error && error.status !== 403) {
        console.error('Non-403 error during sign out:', error);
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still clear the session state even if there's an error
      setSession(null);
      setUser(null);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
