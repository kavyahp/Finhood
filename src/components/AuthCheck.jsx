import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import styles from './AuthCheck.module.css';

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
        // Set a shorter timeout for mobile devices
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('Auth check timed out, proceeding with null user');
            setUser(null);
            setLoading(false);
            handleNavigation(null);
          }
        }, 3000); // 3 second timeout

        // Check if we already have a session in localStorage to speed up initial load
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          try {
            const parsedSession = JSON.parse(storedSession);
            if (parsedSession && parsedSession.access_token) {
              // We have a token, set user immediately and verify in background
              if (mounted) {
                setUser({ id: parsedSession.user?.id });
                setLoading(false);
                handleNavigation({ id: parsedSession.user?.id });
              }
            }
          } catch (e) {
            console.error('Error parsing stored session:', e);
          }
        }

        // Verify session with Supabase
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
    // If user is not authenticated and not on landing/login/signup/auth/callback
    else if (
      !sessionUser &&
      !['/', '/login', '/signup', '/auth/callback'].includes(location.pathname)
    ) {
      navigate('/', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading your account...</p>
      </div>
    );
  }

  return children;
}
