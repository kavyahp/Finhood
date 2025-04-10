import { useState, useRef, useEffect } from 'react';

export default function EditTransactionCard({ transaction, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: transaction.title,
    amount: transaction.amount.toString(),
    category: transaction.category,
    date: new Date(transaction.date).toISOString().split('T')[0],
  });
  const titleInputRef = useRef(null);

  useEffect(() => {
    // Focus on the title input when the component mounts
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      });
      onClose();
    }
  };

  return (
    <div className="edit-card">
      <div className="edit-card-header">
        <h3>Edit {transaction.type === 'expense' ? 'Expense' : 'Income'}</h3>
        <button className="edit-card-close" onClick={onClose}>×</button>
      </div>
      
      <form onSubmit={handleSubmit} className="edit-card-form">
        <div className="edit-card-grid">
          <div className="edit-card-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              ref={titleInputRef}
            />
          </div>

          <div className="edit-card-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="edit-card-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {transaction.type === 'expense' ? (
                <>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </>
              ) : (
                <>
                  <option value="salary">Salary</option>
                  <option value="bonus">Bonus</option>
                  <option value="gift">Gift</option>
                  <option value="refund">Refund</option>
                  <option value="other">Other</option>
                </>
              )}
            </select>
          </div>

          <div className="edit-card-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="edit-card-actions">
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
