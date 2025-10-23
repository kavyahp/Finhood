import { useTheme } from '../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className={`${styles.toggleIcon} ${isDark ? styles.dark : styles.light}`}>
        {isDark ? '🌙' : '☀️'}
      </div>
      <span className={styles.toggleText}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
