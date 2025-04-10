import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpensesContext';
import Navbar from './Navbar';
import ExpensesList from './ExpensesList';
import AddExpense from './AddExpense';

export default function Dashboard() {
  const { user } = useAuth();
  const { expenses, loading, error, addExpense, deleteExpense } = useExpenses();
  const [userName, setUserName] = useState('');
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved || 'USD';
  });

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
  });

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  };

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata.name || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    try {
      await addExpense({
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
      });

      setFormData({
        title: '',
        amount: '',
        category: 'other',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome, {userName ? userName : 'User'}!</p>
        </div>

        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="dashboard-content">
            <div className="card">
              <AddExpense
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                currency={currency}
                setCurrency={setCurrency}
                currencySymbols={currencySymbols}
              />
            </div>
            <div className="card mt-4">
              <ExpensesList
                expenses={expenses}
                handleDelete={handleDelete}
                currency={currency}
                currencySymbols={currencySymbols}
                totalSpent={totalSpent}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
