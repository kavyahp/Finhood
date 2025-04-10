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
    fetchTransactions()
  }, [user])

  async function fetchTransactions() {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) return

      const [expensesData, incomeData] = await Promise.all([
        transactionService.getExpenses(user.id),
        transactionService.getIncomes(user.id)
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
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  }
}
