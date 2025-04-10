import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../hooks/useExpenses';
import Navbar from './Navbar';
import TransactionForm from './TransactionForm';
import CurrencySelector from './CurrencySelector';

export default function Dashboard() {
  const { user } = useAuth();
  const { expenses, income, loading, error, addTransaction, deleteTransaction, refreshTransactions } = useTransactions();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  };

  useEffect(() => {
    if (user) {
      setUserName(user.user_metadata.name || '');
    }
  }, [user]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleExpenseClick = () => {
    setShowExpenseForm(true);
    setShowIncomeForm(false);
  };

  const handleIncomeClick = () => {
    setShowIncomeForm(true);
    setShowExpenseForm(false);
  };

  const calculateTotal = (transactions, type) => {
    return transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount);
      return sum + (type === 'expense' ? -amount : amount);
    }, 0).toFixed(2);
  };

  const handleEdit = (transaction) => {
    console.log('Edit transaction:', transaction);
  };

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

  if (error) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-grid">
      <Navbar />
      <main className="container">
        <header className="dashboard-header">
          <div className="user-info">
            <p>Welcome, {userName ? userName : 'User'}!</p>
            <CurrencySelector />
          </div>
        </header>

        <div className="transaction-type-selector">
          <button
            className={`btn ${showIncomeForm ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleIncomeClick}
          >
            + Add Income
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '16px',
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={handleExpenseClick}
          >
            + Add Expense
          </button>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {showIncomeForm && (
          <TransactionForm
            onClose={() => {
              setShowIncomeForm(false);
              refreshTransactions();
            }}
            onSubmit={async (transaction) => {
              try {
                await addTransaction({
                  ...transaction,
                  amount: parseFloat(transaction.amount),
                  type: 'income'
                });
                setSuccessMessage('Income added successfully!');
              } catch (err) {
                console.error(err.message);
              }
            }}
            type="income"
          />
        )}

        {showExpenseForm && (
          <TransactionForm
            onClose={() => {
              setShowExpenseForm(false);
              refreshTransactions();
            }}
            onSubmit={async (transaction) => {
              try {
                await addTransaction({
                  ...transaction,
                  amount: parseFloat(transaction.amount),
                  type: 'expense'
                });
                setSuccessMessage('Expense added successfully!');
              } catch (err) {
                console.error(err.message);
              }
            }}
            type="expense"
          />
        )}

        <div className="dashboard-content">
          <div className="transactions-container">
            {/* Income Card - Left Side */}
            <section className="transactions-section">
              <div className="transactions-header">
                <h2>Income</h2>
                <span className="total-amount">Total: +${calculateTotal(income, 'income')}</span>
              </div>
              <div className="transactions-list">
                {income.length === 0 ? (
                  <div className="no-transactions">No income found</div>
                ) : (
                  income.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-details">
                        <div className="transaction-amount">+${transaction.amount.toFixed(2)}</div>
                        <div className="transaction-category">{transaction.category}</div>
                        <div className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</div>
                      </div>
                      <div className="transaction-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(transaction)}
                          aria-label="Edit income"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteTransaction(transaction.id)}
                          aria-label="Delete income"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Expenses Card - Right Side */}
            <section className="transactions-section">
              <div className="transactions-header">
                <h2>Expenses</h2>
                <span className="total-amount">Total: -${calculateTotal(expenses, 'expense')}</span>
              </div>
              <div className="transactions-list">
                {expenses.length === 0 ? (
                  <div className="no-transactions">No expenses found</div>
                ) : (
                  expenses.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-details">
                        <div className="transaction-amount">-${transaction.amount.toFixed(2)}</div>
                        <div className="transaction-category">{transaction.category}</div>
                        <div className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</div>
                      </div>
                      <div className="transaction-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(transaction)}
                          aria-label="Edit expense"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteTransaction(transaction.id)}
                          aria-label="Delete expense"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
