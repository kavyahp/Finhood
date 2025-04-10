import { supabase } from '../lib/supabaseClient'

export const transactionsService = {
  // Get all transactions for the current user
  async getTransactions(type = null) {
    const query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (type) {
      query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Add a new transaction
  async addTransaction(transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update an existing transaction
  async updateTransaction(id, updates) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a transaction
  async deleteTransaction(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get transactions summary (total, by category, etc.)
  async getTransactionsSummary() {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, category, date, type')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}