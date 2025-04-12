import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthCheck({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    // Initialize auth state with timeout
    const initializeAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('Auth check timed out, proceeding with null user');
            setUser(null);
            setLoading(false);
            handleNavigation(null);
          }
        }, 5000); // 5 second timeout

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        // Clear timeout since we got a response
        if (timeoutId) clearTimeout(timeoutId);

        if (error) {
          console.error('Error checking auth:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
            handleNavigation(null);
          }
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          handleNavigation(session?.user);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
          handleNavigation(null);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        handleNavigation(session?.user);
      }
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  // Handle navigation based on auth status
  const handleNavigation = (sessionUser) => {
    // If user is authenticated and not on dashboard
    if (sessionUser && !location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard', { replace: true });
    }
    // If user is not authenticated and not on landing/login/signup
    else if (
      !sessionUser &&
      !['/', '/landing', '/login', '/signup'].includes(location.pathname)
    ) {
      navigate('/landing', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return children;
}
