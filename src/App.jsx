import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { AuthProvider } from './contexts/AuthContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import CurrencySelector from './components/CurrencySelector';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCheck from './components/AuthCheck';

function App() {
  return (
    <Router future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }}>
      <AuthProvider>
        <CurrencyProvider>
          <TransactionsProvider>
            <AuthCheck>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <div className="app-container">
                        <Navbar />
                        <CurrencySelector />
                        <Dashboard />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/landing" replace />} />
              </Routes>
            </AuthCheck>
          </TransactionsProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
