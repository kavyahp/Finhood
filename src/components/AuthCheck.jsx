import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthCheck({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
        
        // Handle initial navigation
        handleNavigation(session?.user);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        handleNavigation(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Handle navigation on auth state change
      handleNavigation(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  // Handle navigation based on auth status
  const handleNavigation = (sessionUser) => {
    // If user is authenticated and not on dashboard
    if (sessionUser && !location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard', { replace: true });
    }
    // If user is not authenticated and not on landing/login/signup
    else if (!sessionUser && ![
      '/', '/landing', '/login', '/signup'
    ].includes(location.pathname)) {
      navigate('/landing', { replace: true });
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return children;
}
