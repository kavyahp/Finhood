import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // First navigate to the login page
      navigate('/login', { replace: true });

      // Then attempt to sign out
      await signOut();

      // Clear any remaining session data
      localStorage.removeItem('supabase.auth.token');

      // Force a page reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error during sign out:', error);
      // If there's an error, still try to navigate to login and clear the session
      localStorage.removeItem('supabase.auth.token');
      navigate('/login', { replace: true });
      window.location.reload();
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
