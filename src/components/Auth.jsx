import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      
      const authAction = location.pathname === '/login' 
        ? signIn 
        : signUp;

      const { error: authError } = await authAction({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      
      // For signup, we need to wait for the session to be created
      if (location.pathname === '/signup') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <img src="/logo.png" alt="Finhood Logo" />
          <h1>{location.pathname === '/login' ? 'Welcome back!' : 'Create your account'}</h1>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading 
                ? (location.pathname === '/login' 
                    ? 'Logging in...' 
                    : 'Creating account...')
                : (location.pathname === '/login' 
                    ? 'Login' 
                    : 'Sign up')}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          {location.pathname === '/login' 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <Link to={location.pathname === '/login' ? '/signup' : '/login'}>
            {location.pathname === '/login' ? 'Sign up' : 'Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}
