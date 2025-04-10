import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { transactionService } from "../services/supabase";

const TransactionsContext = createContext({});
export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
};

export const TransactionsProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, incomeData] = await Promise.all([
        transactionService.getTransactionsByType(user.id, 'expense'),
        transactionService.getTransactionsByType(user.id, 'income')
      ]);
      setTransactions([...expensesData, ...incomeData]);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const dataWithUser = {
        ...transactionData,
        user_id: user.id,
        type: transactionData.type || 'expense'
      };
      const newTransaction = await transactionService.createTransaction(dataWithUser);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err.message);
      console.error("Error adding transaction:", err);
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const updatedTransaction = {
        ...transactions.find(t => t.id === id),
        ...updates,
        amount: parseFloat(updates.amount),
        date: new Date(updates.date).toISOString()
      };
      
      await transactionService.updateTransaction(id, {
        ...updates,
        amount: parseFloat(updates.amount),
        date: new Date(updates.date).toISOString()
      });
      
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      
      return updatedTransaction;
    } catch (err) {
      setError(err.message);
      console.error("Error updating transaction:", err);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting transaction:", err);
      throw err;
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshTransactions: fetchTransactions
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
