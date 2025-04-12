import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // First clear local state and storage
      localStorage.removeItem('supabase.auth.token');

      // Then attempt to sign out from Supabase
      const { error } = await signOut();

      if (error) {
        console.error('Error during sign out:', error);
      }

      // Always navigate to login page, regardless of sign-out success
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Even if there's an error, ensure we redirect to login
      navigate('/login', { replace: true });
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
