import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatabaseOperations, DatabaseConfig, DatabaseProvider as DbProvider } from './types';
import { DatabaseFactory } from './factory';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default database configuration
const DEFAULT_CONFIG: DatabaseConfig = {
  provider: DbProvider.LOCAL,
  local: {
    encryptData: false
  }
};

// Storage key for database configuration
const DB_CONFIG_STORAGE_KEY = 'sparx_db_config';

// Context for database operations
interface DatabaseContextType {
  db: DatabaseOperations | null;
  config: DatabaseConfig;
  isLoading: boolean;
  error: Error | null;
  switchProvider: (newConfig: DatabaseConfig) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  config: DEFAULT_CONFIG,
  isLoading: true,
  error: null,
  switchProvider: async () => {}
});

/**
 * Database provider component
 * Makes the database available throughout the application
 */
export const DatabaseContextProvider: React.FC<{
  children: React.ReactNode;
  initialConfig?: DatabaseConfig;
}> = ({ children, initialConfig }) => {
  const [db, setDb] = useState<DatabaseOperations | null>(null);
  const [config, setConfig] = useState<DatabaseConfig>(initialConfig || DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize the database
  useEffect(() => {
    const initDatabase = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to load saved configuration from AsyncStorage
        if (!initialConfig) {
          const savedConfigJson = await AsyncStorage.getItem(DB_CONFIG_STORAGE_KEY);
          if (savedConfigJson) {
            const savedConfig = JSON.parse(savedConfigJson);
            setConfig(savedConfig);
          }
        }

        // Create and connect to the database
        const dbInstance = DatabaseFactory.createDatabase(
          initialConfig || config
        );
        await dbInstance.connect();
        
        setDb(dbInstance);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();

    // Cleanup function
    return () => {
      if (db) {
        db.disconnect().catch(err => {
          console.error('Error disconnecting from database:', err);
        });
      }
    };
  }, [initialConfig]);

  /**
   * Switch to a different database provider
   * @param newConfig New database configuration
   */
  const switchProvider = async (newConfig: DatabaseConfig) => {
    try {
      setIsLoading(true);
      setError(null);

      // Switch to the new provider
      const newDb = await DatabaseFactory.switchProvider(newConfig);
      
      // Save the new configuration to AsyncStorage
      await AsyncStorage.setItem(DB_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      
      // Update state
      setDb(newDb);
      setConfig(newConfig);
    } catch (err) {
      console.error('Failed to switch database provider:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        db,
        config,
        isLoading,
        error,
        switchProvider
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

/**
 * Hook to use the database context
 * @returns Database context
 */
export const useDatabase = () => useContext(DatabaseContext);

// Export the provider with a more descriptive name
export { DatabaseContextProvider as DatabaseProvider };