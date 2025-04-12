import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // First attempt to sign out
      await signOut();

      // Then navigate to the login page after successful sign out
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      // If there's an error, still try to navigate to login
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
