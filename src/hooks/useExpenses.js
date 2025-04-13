import { useState, useEffect } from 'react'
import { transactionService } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useTransactions() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      fetchTransactions()
    } else {
      setLoading(false)
      setExpenses([])
      setIncome([])
    }
  }, [user])

  async function fetchTransactions() {
    try {
      setLoading(true)
      setError(null)
      
      const [expensesData, incomeData] = await Promise.all([
        transactionService.getTransactionsByType(user.id, 'expense'),
        transactionService.getTransactionsByType(user.id, 'income')
      ])

      setExpenses(expensesData || [])
      setIncome(incomeData || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addTransaction(transactionData) {
    try {
      setError(null)
      
      const dataWithUser = {
        ...transactionData,
        user_id: user.id,
        type: transactionData.type || 'expense'
      }
      
      const newTransaction = await transactionService.createTransaction(dataWithUser)
      
      // Add to the correct list based on type
      if (newTransaction.type === 'expense') {
        setExpenses(prev => [newTransaction, ...prev])
      } else {
        setIncome(prev => [newTransaction, ...prev])
      }
      
      return newTransaction
    } catch (err) {
      setError(err.message)
      console.error('Error adding transaction:', err)
      throw err
    }
  }

  async function updateTransaction(id, updates) {
    try {
      setError(null)
      
      // First update the local state to provide immediate feedback
      const updatedTransaction = {
        ...expenses.find(t => t.id === id) || income.find(t => t.id === id),
        ...updates,
        amount: parseFloat(updates.amount),
        date: new Date(updates.date).toISOString()
      };
      
      // Update both lists
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === id ? updatedTransaction : expense
        )
      )
      
      setIncome(prev => 
        prev.map(income => 
          income.id === id ? updatedTransaction : income
        )
      )
      
      // Then update in the database
      await transactionService.updateTransaction(id, {
        ...updates,
        amount: parseFloat(updates.amount),
        date: new Date(updates.date).toISOString()
      });
      
      return updatedTransaction
    } catch (err) {
      setError(err.message)
      console.error('Error updating transaction:', err)
      throw err
    }
  }

  async function deleteTransaction(id) {
    try {
      setError(null)
      await transactionService.deleteTransaction(id)
      
      // Remove from both lists
      setExpenses(prev => prev.filter(expense => expense.id !== id))
      setIncome(prev => prev.filter(income => income.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting transaction:', err)
      throw err
    }
  }

  return {
    expenses,
    income,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  }
}
