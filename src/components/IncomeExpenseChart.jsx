import { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useExpenses';
import { useCurrency } from '../contexts/CurrencyContext';
import styles from './IncomeExpenseChart.module.css';

export default function IncomeExpenseChart() {
  const { income, expenses } = useTransactions();
  const { currency } = useCurrency();
  const [chartData, setChartData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hasData, setHasData] = useState(true);

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  };

  useEffect(() => {
    // Filter transactions by selected month and year
    const filteredIncome = income.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === selectedMonth && 
             transactionDate.getFullYear() === selectedYear;
    });

    const filteredExpenses = expenses.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === selectedMonth && 
             transactionDate.getFullYear() === selectedYear;
    });

    // Calculate totals for filtered data
    const incomeTotal = filteredIncome.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.amount);
    }, 0);

    const expensesTotal = filteredExpenses.reduce((sum, transaction) => {
      return sum + parseFloat(transaction.amount);
    }, 0);

    setTotalIncome(incomeTotal);
    setTotalExpenses(expensesTotal);

    // Check if there's any data for the selected month
    const hasAnyData = incomeTotal > 0 || expensesTotal > 0;
    setHasData(hasAnyData);

    // Create chart data
    const data = [
      { label: 'Income', value: incomeTotal, color: '#10b981' },
      { label: 'Expenses', value: expensesTotal, color: '#ef4444' }
    ];

    setChartData(data);
  }, [income, expenses, selectedMonth, selectedYear]);

  const formatAmount = (amount) => {
    const symbol = currencySymbols[currency] || currencySymbols.INR;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  const getMaxValue = () => {
    return Math.max(totalIncome, totalExpenses);
  };

  const getBarHeight = (value) => {
    const maxValue = getMaxValue();
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  const getNetAmount = () => {
    return totalIncome - totalExpenses;
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Income vs Expenses</h3>
        <div className={styles.netAmount}>
          Net: {formatAmount(getNetAmount())}
        </div>
      </div>

      <div className={styles.selectorContainer}>
        <div className={styles.selectorGroup}>
          <label htmlFor="month-select" className={styles.selectorLabel}>Month:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className={styles.selector}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {getMonthName(i)}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.selectorGroup}>
          <label htmlFor="year-select" className={styles.selectorLabel}>Year:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className={styles.selector}
          >
            {getAvailableYears().map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.chartContainer}>
        {hasData ? (
          <div className={styles.chart}>
            {chartData.map((item, index) => (
              <div key={index} className={styles.barContainer}>
                <div className={styles.barLabel}>{item.label}</div>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${getBarHeight(item.value)}%`,
                      backgroundColor: item.color,
                    }}
                  >
                    <span className={styles.barValue}>
                      {formatAmount(item.value)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noDataContainer}>
            <div className={styles.noDataIcon}>📊</div>
            <div className={styles.noDataTitle}>No Data Available</div>
            <div className={styles.noDataMessage}>
              No income or expense data found for {getMonthName(selectedMonth)} {selectedYear}
            </div>
          </div>
        )}
      </div>

      {hasData && (
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Total Income</div>
            <div className={styles.summaryValue} style={{ color: '#10b981' }}>
              {formatAmount(totalIncome)}
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Total Expenses</div>
            <div className={styles.summaryValue} style={{ color: '#ef4444' }}>
              {formatAmount(totalExpenses)}
            </div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Net Amount</div>
            <div 
              className={styles.summaryValue} 
              style={{ 
                color: getNetAmount() >= 0 ? '#10b981' : '#ef4444' 
              }}
            >
              {formatAmount(getNetAmount())}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
