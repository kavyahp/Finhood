import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import styles from './EmailVerification.module.css';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const hash = window.location.hash;
        if (!hash) {
          throw new Error('No verification data found');
        }

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (!accessToken || !refreshToken) {
          throw new Error('Invalid verification data');
        }

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) throw error;

        setVerificationStatus('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message);
      }
    };

    handleEmailVerification();
  }, [navigate]);

  if (verificationStatus === 'loading') {
    return (
      <div className={styles['verification-message']}>
        <p>Verifying your email...</p>
        <div className={styles['loading-spinner']} />
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className={styles['success-message']}>
        <p>Email verified successfully!</p>
        <p>Redirecting you to the dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles['error-message']}>
      <p>Error verifying email: {errorMessage}</p>
      <button onClick={() => navigate('/login')}>Return to Login</button>
    </div>
  );
};

export default EmailVerification;
