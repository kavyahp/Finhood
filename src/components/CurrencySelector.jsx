import { useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencySelector = () => {
  const { currency, loading, updateCurrencyPreference } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];

  const handleChange = async (event) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);
    try {
      await updateCurrencyPreference(newCurrency);
    } catch (error) {
      console.error('Failed to update currency preference:', error);
      setSelectedCurrency(currency); // Revert back to previous value
    }
  };

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <div className="currency-selector">
      <select
        value={selectedCurrency}
        onChange={handleChange}
        className="currency-select"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
