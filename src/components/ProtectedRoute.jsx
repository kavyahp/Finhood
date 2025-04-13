import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import styles from './AuthCheck.module.css';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isValidSession, setIsValidSession] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    const checkSession = async () => {
      try {
        // Set a shorter timeout for mobile devices
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('Session check timed out, redirecting to login');
            setUser(null);
            setLoading(false);
            setIsValidSession(false);
            // Clear any potentially invalid session data
            localStorage.removeItem('supabase.auth.token');
          }
        }, 3000); // 3 second timeout

        // First, check if the URL is /dashboard but there's no stored session
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (!storedSession && location.pathname === '/dashboard') {
          console.log('No stored session found, redirecting to login');
          setUser(null);
          setLoading(false);
          setIsValidSession(false);
          return;
        }

        // Verify session with Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        // Clear timeout since we got a response
        if (timeoutId) clearTimeout(timeoutId);

        if (error || !session) {
          console.error('Error checking session or no session found:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
            setIsValidSession(false);
            // Clear invalid session data
            localStorage.removeItem('supabase.auth.token');
          }
          return;
        }

        if (mounted) {
          setUser(session.user);
          setIsValidSession(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setUser(null);
          setIsValidSession(false);
          setLoading(false);
          // Clear potentially corrupted session data
          localStorage.removeItem('supabase.auth.token');
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        if (session) {
          setUser(session.user);
          setIsValidSession(true);
        } else {
          setUser(null);
          setIsValidSession(false);
          // Clear session data on sign out
          localStorage.removeItem('supabase.auth.token');
        }
      }
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Verifying your session...</p>
      </div>
    );
  }

  if (!user || !isValidSession) {
    // Clear any invalid session data before redirecting
    localStorage.removeItem('supabase.auth.token');
    // Redirect to login with the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
