import { useState, useEffect } from 'react'
import { expenseService } from '../services/supabase'

export function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    try {
      setLoading(true)
      setError(null)
      const data = await expenseService.getAllExpenses()
      setExpenses(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addExpense(expenseData) {
    try {
      setError(null)
      const newExpense = await expenseService.createExpense(expenseData)
      setExpenses(prev => [newExpense, ...prev])
      return newExpense
    } catch (err) {
      setError(err.message)
      console.error('Error adding expense:', err)
      throw err
    }
  }

  async function deleteExpense(id) {
    try {
      setError(null)
      await expenseService.deleteExpense(id)
      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting expense:', err)
      throw err
    }
  }

  return {
    expenses,
    loading,
    error,
    addExpense,
    deleteExpense,
    refreshExpenses: fetchExpenses,
  }
}
