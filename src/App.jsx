import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import CurrencySelector from './components/CurrencySelector';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCheck from './components/AuthCheck';
import EmailVerification from './components/EmailVerification';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <TransactionsProvider>
              <AuthCheck>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/auth/callback" element={<EmailVerification />} />
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AuthCheck>
            </TransactionsProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
