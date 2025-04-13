import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../hooks/useExpenses';
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from './Navbar';
import TransactionForm from './TransactionForm';
import EditTransactionCard from './EditTransactionCard';
import CurrencySelector from './CurrencySelector';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    expenses,
    income,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refreshTransactions,
  } = useTransactions();
  const { currency } = useCurrency();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
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
    return transactions
      .reduce((sum, transaction) => {
        const amount = parseFloat(transaction.amount);
        return sum + (type === 'expense' ? -amount : amount);
      }, 0)
      .toFixed(2);
  };

  const formatAmount = (amount, type) => {
    const symbol = currencySymbols[currency] || currencySymbols.INR;
    const prefix = type === 'expense' ? '-' : '+';
    const numericAmount = parseFloat(amount) || 0;
    return `${prefix}${symbol}${numericAmount.toFixed(2)}`;
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditSubmit = async (formData) => {
    try {
      await updateTransaction(editingTransaction.id, formData);
      setSuccessMessage('Transaction updated successfully!');
      setEditingTransaction(null);
      refreshTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      setSuccessMessage('Error updating transaction. Please try again.');
    }
  };

  const handleCloseExpenseForm = () => {
    setShowExpenseForm(false);
    setShowIncomeForm(false);
  };

  const handleCloseIncomeForm = () => {
    setShowIncomeForm(false);
    setShowExpenseForm(false);
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

        <div className={styles.balanceSection}>
          <h2 className={styles.balanceTitle}>Current Balance</h2>
          {income.length === 0 && expenses.length === 0 ? (
            <p className={styles.noDataText}>Add income and expense data</p>
          ) : (
            <p
              className={`${styles.balanceAmount} ${
                parseFloat(calculateTotal(income, 'income')) +
                  parseFloat(calculateTotal(expenses, 'expense')) >=
                0
                  ? styles.positiveBalance
                  : styles.negativeBalance
              }`}
            >
              {currencySymbols[currency]}
              {Math.abs(
                parseFloat(calculateTotal(income, 'income')) +
                  parseFloat(calculateTotal(expenses, 'expense'))
              ).toFixed(2)}
            </p>
          )}
        </div>

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
              justifyContent: 'center',
            }}
            onClick={handleExpenseClick}
          >
            + Add Expense
          </button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {editingTransaction && (
          <EditTransactionCard
            transaction={editingTransaction}
            onSubmit={handleEditSubmit}
            onClose={() => setEditingTransaction(null)}
          />
        )}

        {showIncomeForm && (
          <TransactionForm
            onSubmit={async (formData) => {
              try {
                await addTransaction({
                  ...formData,
                  type: 'income',
                });
                setSuccessMessage('Income added successfully!');
                handleCloseIncomeForm();
                refreshTransactions();
              } catch (err) {
                console.error(err.message);
                setSuccessMessage('Error adding income. Please try again.');
              }
            }}
            onClose={handleCloseIncomeForm}
            type="income"
          />
        )}

        {showExpenseForm && (
          <TransactionForm
            onSubmit={async (formData) => {
              try {
                await addTransaction({
                  ...formData,
                  type: 'expense',
                });
                setSuccessMessage('Expense added successfully!');
                handleCloseExpenseForm();
                refreshTransactions();
              } catch (err) {
                console.error(err.message);
                setSuccessMessage('Error adding expense. Please try again.');
              }
            }}
            onClose={handleCloseExpenseForm}
            type="expense"
          />
        )}

        <div className="dashboard-content">
          <div className="transactions-container">
            {/* Income Card - Left Side */}
            <section className="transactions-section">
              <div className="transactions-header">
                <h2>Income</h2>
                <span className="total-amount">
                  Total:{' '}
                  {formatAmount(calculateTotal(income, 'income'), 'income')}
                </span>
              </div>
              <div className="transactions-list">
                {income.length === 0 ? (
                  <div className="no-transactions">No income found</div>
                ) : (
                  income.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-details">
                        <span className="transaction-title">
                          {transaction.title}
                        </span>
                        <span className="transaction-amount">
                          {formatAmount(transaction.amount, 'income')}
                        </span>
                        <span className="transaction-category">
                          {transaction.category}
                        </span>
                        <span className="transaction-date">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
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
                <span className="total-amount">
                  Total:{' '}
                  {formatAmount(calculateTotal(expenses, 'expense'), 'expense')}
                </span>
              </div>
              <div className="transactions-list">
                {expenses.length === 0 ? (
                  <div className="no-transactions">No expenses found</div>
                ) : (
                  expenses.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-details">
                        <span className="transaction-title">
                          {transaction.title}
                        </span>
                        <span className="transaction-amount">
                          {formatAmount(transaction.amount, 'expense')}
                        </span>
                        <span className="transaction-category">
                          {transaction.category}
                        </span>
                        <span className="transaction-date">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
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
