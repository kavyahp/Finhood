import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
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
          }
        }, 2000); // 2 second timeout (reduced from 5s)

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
          console.error('Error checking session:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
