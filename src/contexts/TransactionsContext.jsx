import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { transactionsService } from '../services/transactionsService';

const TransactionsContext = createContext({});

export const useTransactions = () => useContext(TransactionsContext);

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('expense');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionsService.getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const newTransaction = await transactionsService.addTransaction({
        ...transaction,
        user_id: user.id,
        type: selectedType
      });
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const updatedTransaction = await transactionsService.updateTransaction(id, updates);
      setTransactions((prev) =>
        prev.map((transaction) => (transaction.id === id ? updatedTransaction : transaction))
      );
      return updatedTransaction;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionsService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    transactions,
    loading,
    error,
    selectedType,
    setSelectedType,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: loadTransactions,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}
