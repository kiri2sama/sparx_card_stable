import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme, ThemeMode } from './theme';

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  themeMode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

type ThemeProviderProps = {
  children: ReactNode;
  initialThemeMode?: ThemeMode;
  useSystemTheme?: boolean;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialThemeMode = 'light',
  useSystemTheme = true
}) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // Initialize theme mode based on system or initial preference
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    useSystemTheme && systemColorScheme === 'dark' ? 'dark' : initialThemeMode
  );
  
  // Derived state
  const isDarkMode = themeMode === 'dark';
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  
  // Listen for system theme changes if enabled
  useEffect(() => {
    if (!useSystemTheme) return;
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === 'dark' || colorScheme === 'light') {
        setThemeMode(colorScheme);
      }
    });
    
    return () => {
      subscription.remove();
    };
  }, [useSystemTheme]);
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme: currentTheme, 
        isDarkMode, 
        toggleTheme, 
        setThemeMode,
        themeMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};