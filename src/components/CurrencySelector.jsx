import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const currencies = {
  USD: { symbol: '$', label: 'US Dollar' },
  EUR: { symbol: '€', label: 'Euro' },
  GBP: { symbol: '£', label: 'British Pound' },
  INR: { symbol: '₹', label: 'Indian Rupee' },
  JPY: { symbol: '¥', label: 'Japanese Yen' }
};

export default function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const { user } = useAuth();

  const saveCurrencyPreference = async (currency) => {
    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          currency: currency
        });
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  return (
    <div className="currency-selector">
      <select
        value={selectedCurrency}
        onChange={(e) => {
          setSelectedCurrency(e.target.value);
          saveCurrencyPreference(e.target.value);
        }}
        className="currency-select"
      >
        {Object.entries(currencies).map(([code, { symbol, label }]) => (
          <option key={code} value={code}>
            {symbol} {label}
          </option>
        ))}
      </select>
    </div>
  );
}
