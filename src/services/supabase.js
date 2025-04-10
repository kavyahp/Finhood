import { supabase } from '../lib/supabaseClient'

export const authService = {
  // Authentication methods
  signUp: (data) => supabase.auth.signUp(data),
  signIn: (data) => supabase.auth.signInWithPassword(data),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
}

export const expenseService = {
  // Expense CRUD operations
  async getAllExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createExpense({ title, amount, category, date }) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ title, amount, category, date }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateExpense(id, updates) {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteExpense(id) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
