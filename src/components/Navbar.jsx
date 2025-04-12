import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { clearAuthData } from '../lib/supabaseClient';

export default function Navbar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      const { error } = await signOut();

      if (error) {
        console.error('Error during sign out:', error);
        return;
      }

      console.log('Sign out successful, clearing auth data...');
      clearAuthData();

      console.log('Redirecting to login...');
      // Force a hard redirect to login page to ensure complete sign out
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      // Clear auth data and redirect even if there's an error
      clearAuthData();
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src="/logo.png" alt="Finhood Logo" className="navbar-logo" />
        <button onClick={handleSignOut} className="navbar-signout">
          Sign Out
        </button>
      </div>
    </nav>
  );
}
