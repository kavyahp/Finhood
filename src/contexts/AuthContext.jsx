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
      console.log('Auth state changed:', event, session);

      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        // Clear session data
        setSession(null);
        setUser(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Update session data
        setSession(session);
        setUser(session?.user ?? null);
      }

      setLoading(false);
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
      // Clear local session data first
      setSession(null);
      setUser(null);

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, ensure we clear local state
      setSession(null);
      setUser(null);
      localStorage.removeItem('supabase.auth.token');
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
