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
    <div className="layout-grid">
      <Navbar />
      <main className="container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <p>Welcome, {userName ? userName : 'User'}!</p>
          </div>
        </header>

        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="dashboard-content">
            <section className="expense-form-section card">
              <AddExpense
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                currency={currency}
                setCurrency={setCurrency}
                currencySymbols={currencySymbols}
              />
            </section>
            <section className="expenses-section card">
              <ExpensesList
                expenses={expenses}
                handleDelete={handleDelete}
                currency={currency}
                currencySymbols={currencySymbols}
                totalSpent={totalSpent}
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
