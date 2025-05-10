import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigation
import RootNavigator from './navigation';

// Theme Provider
import { ThemeProvider, useTheme } from './styles/ThemeProvider';

// i18n
import './i18n';

// App Content with theme
const AppContent = () => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background}
      />
      <PaperProvider theme={{
        ...theme,
        colors: {
          ...theme.colors,
          primary: theme.colors.primary,
          accent: theme.colors.secondary,
          background: theme.colors.background,
          surface: theme.colors.card,
          text: theme.colors.text,
          disabled: theme.colors.disabled,
          placeholder: theme.colors.placeholder,
          backdrop: 'rgba(0, 0, 0, 0.5)',
          onSurface: theme.colors.text,
          notification: theme.colors.error,
        }
      }}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};

// Main App component
const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;