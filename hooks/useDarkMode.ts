import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useDarkMode(): [boolean, () => void] {
  // Check for system preference, but only use it as the initial value if no localStorage value exists.
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const [isDark, setIsDark] = useLocalStorage<boolean>('darkMode', systemPrefersDark);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return [isDark, toggleTheme];
}
