import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated, error, clearError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h2>Loading...</h2>
          <p>Please wait while we check your session.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => clearError()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
