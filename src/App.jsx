import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import CurrencySelector from './components/CurrencySelector';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { loading, error, clearError, user } = useAuth();

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
          <button onClick={clearError}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <TransactionsProvider>
            {user && <Navbar />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <CurrencySelector />
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <CurrencySelector />
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </TransactionsProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
