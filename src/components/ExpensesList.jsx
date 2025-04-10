import { useState } from 'react';
import { useExpenses } from '../contexts/ExpensesContext';
import EditExpenseModal from './EditExpenseModal';

export default function ExpensesList() {
  const { expenses, loading, error, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  if (loading) return <div>Loading expenses...</div>;
  if (error) return <div>Error: {error}</div>;
  if (expenses.length === 0) return <div>No expenses found</div>;

  return (
    <div className="expenses-list">
      <h2>Your Expenses</h2>
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button
            className="message-close"
            onClick={() => setSuccessMessage('')}
          >
            ×
          </button>
        </div>
      )}
      <div className="expenses-grid">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-card">
            <div className="expense-header">
              <h3>{expense.title}</h3>
              <div className="expense-actions">
                <button
                  onClick={() => setEditingExpense(expense)}
                  className="edit-btn"
                  aria-label="Edit expense"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="delete-btn"
                  aria-label="Delete expense"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="expense-details">
              <p>Amount: ${expense.amount.toFixed(2)}</p>
              <p>Category: {expense.category || 'Uncategorized'}</p>
              <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={() => {
            setSuccessMessage('Expense updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
        />
      )}
    </div>
  );
}
