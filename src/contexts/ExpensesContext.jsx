import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { expensesService } from '../services/expensesService';

const ExpensesContext = createContext({});

export const useExpenses = () => useContext(ExpensesContext);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expensesService.getExpenses();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense) => {
    try {
      const newExpense = await expensesService.addExpense({
        ...expense,
        user_id: user.id,
      });
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateExpense = async (id, updates) => {
    try {
      const updatedExpense = await expensesService.updateExpense(id, updates);
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense : expense))
      );
      return updatedExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expensesService.deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: loadExpenses,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}
