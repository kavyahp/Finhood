import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

const CurrencyContext = createContext({});

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencyPreference = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('currency')
          .eq('id', user.id)
          .single();

        if (error) {
          // Create default profile if it doesn't exist
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{ id: user.id, currency: 'INR' }]);

          if (createError) throw createError;
        } else {
          setCurrency(profile.currency);
        }
      } catch (error) {
        console.error('Error fetching currency preference:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyPreference();
  }, [user]);

  const updateCurrencyPreference = async (newCurrency) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ currency: newCurrency })
        .eq('id', user.id);

      if (error) throw error;
      setCurrency(newCurrency);
    } catch (error) {
      console.error('Error updating currency preference:', error);
      throw error;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      loading,
      updateCurrencyPreference,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
