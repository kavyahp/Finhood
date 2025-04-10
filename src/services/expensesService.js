import { supabase } from '../lib/supabaseClient'

export const expensesService = {
  // Get all expenses for the current user
  async getExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add a new expense
  async addExpense(expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update an existing expense
  async updateExpense(id, updates) {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete an expense
  async deleteExpense(id) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get expenses summary (total, by category, etc.)
  async getExpensesSummary() {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount, category, date')
    
    if (error) throw error
    return data
  }
} 