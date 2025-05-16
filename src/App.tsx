import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View, Text, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigation
import MainTabs from './navigation';

// Theme Provider
import { ThemeProvider, useTheme } from './styles/ThemeProvider';

// Database Provider
import { DatabaseProvider } from './database/context';
import { useDatabaseService } from './database/service';
import { DatabaseProvider as DbProvider } from './database/types';

// i18n
import './i18n';

// Database initialization component
const DatabaseInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { runMigrations, isLoading, error } = useDatabaseService();
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationError, setMigrationError] = useState<Error | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Run migrations
        await runMigrations();
        setMigrationComplete(true);
      } catch (err) {
        console.error('Failed to run database migrations:', err);
        setMigrationError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    if (!isLoading && !error) {
      initializeDatabase();
    }
  }, [isLoading, error, runMigrations]);

  if (isLoading || !migrationComplete) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.text }}>
          Initializing database...
        </Text>
      </View>
    );
  }

  if (error || migrationError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.error, fontSize: 18, marginBottom: 16 }}>
          Database Error
        </Text>
        <Text style={{ color: theme.colors.text, textAlign: 'center' }}>
          {(error || migrationError)?.message}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

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
          <DatabaseInitializer>
            <MainTabs />
          </DatabaseInitializer>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};

// Main App component
const App = () => {
  // Default database configuration
  const initialDbConfig = {
    provider: DbProvider.LOCAL,
    local: {
      encryptData: false
    }
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DatabaseProvider initialConfig={initialDbConfig}>
          <AppContent />
        </DatabaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;