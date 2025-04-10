import { useState } from 'react';
import { useExpenses } from '../contexts/ExpensesContext';

const categories = [
  'Food',
  'Transportation',
  'Housing',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Other',
];

export default function AddExpense({
  formData,
  setFormData,
  handleSubmit,
  currency,
  setCurrency,
  currencySymbols,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addExpense } = useExpenses();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    setIsSubmitting(true);
    try {
      await handleSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="expense-form">
      <div className="expense-form-header">
        <h2 className="expense-form-title">Add New Expense</h2>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="expense-form-select"
          style={{ width: '80px' }}
        >
          {Object.keys(currencySymbols).map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>

      <div className="expense-form-grid">
        <div className="expense-form-group">
          <label className="expense-form-label">Title</label>
          <input
            type="text"
            className="expense-form-input"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter expense title"
            required
          />
        </div>

        <div className="expense-form-group">
          <label className="expense-form-label">Amount</label>
          <input
            type="number"
            className="expense-form-input"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder={`Enter amount in ${currency}`}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="expense-form-group">
          <label className="expense-form-label">Category</label>
          <select
            className="expense-form-select"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
            <option value="bills">Bills</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="expense-form-group">
          <label className="expense-form-label">Date</label>
          <input
            type="date"
            className="expense-form-input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="expense-form-submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
