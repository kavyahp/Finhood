import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const validateForm = () => {
    // Check if name is provided
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check if password meets requirements
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to sign up with:', {
        email: formData.email,
        password: '********',
        metadata: { name: formData.name },
      });

      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        metadata: {
          name: formData.name,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      setShowVerificationMessage(true);
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      console.error('Signup exception:', err);
      setError(
        err.message || 'An error occurred during signup. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-card-header">
          <img src="/logo.png" alt="Finhood Logo" />
          <h1>Create your account</h1>
        </div>

        <div className="auth-card-content">
          {error && <div className="error-message">{error}</div>}
          {showVerificationMessage ? (
            <div className="verification-message">
              📩 Please check your email to verify your account. We'll redirect
              you to login in a few seconds.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-card-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                  minLength={6}
                />
                <small>Password must be at least 6 characters long</small>
              </div>
              <button
                type="submit"
                className="auth-card-button"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
          )}
        </div>

        <div className="auth-card-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
