import { useExpenses } from '../contexts/ExpensesContext';

export default function ExpensesList() {
  const { expenses, loading, error, deleteExpense } = useExpenses();

  if (loading) return <div>Loading expenses...</div>;
  if (error) return <div>Error: {error}</div>;
  if (expenses.length === 0) return <div>No expenses found</div>;

  return (
    <div className="expenses-list">
      <h2>Your Expenses</h2>
      <div className="expenses-grid">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-card">
            <div className="expense-header">
              <h3>{expense.title}</h3>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
            <div className="expense-details">
              <p>Amount: ${expense.amount}</p>
              <p>Category: {expense.category || 'Uncategorized'}</p>
              <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
