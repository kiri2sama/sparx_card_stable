import { DatabaseConfig, DatabaseOperations, DatabaseProvider } from './types';
import { PostgresDatabase } from './providers/postgres';
import { FirebaseDatabase } from './providers/firebase';
import { SupabaseDatabase } from './providers/supabase';
import { LocalDatabase } from './providers/local';

/**
 * Database factory class for creating database instances
 * This allows switching between different database providers
 */
export class DatabaseFactory {
  private static instance: DatabaseOperations | null = null;
  private static currentConfig: DatabaseConfig | null = null;

  /**
   * Create a database instance based on the provided configuration
   * @param config Database configuration
   * @returns Database operations instance
   */
  public static createDatabase(config: DatabaseConfig): DatabaseOperations {
    // If we already have an instance with the same provider, return it
    if (
      this.instance && 
      this.currentConfig && 
      this.currentConfig.provider === config.provider
    ) {
      return this.instance;
    }

    // Otherwise, create a new instance based on the provider
    switch (config.provider) {
      case DatabaseProvider.POSTGRES:
        if (!config.postgres) {
          throw new Error('PostgreSQL configuration is required when using PostgreSQL provider');
        }
        this.instance = new PostgresDatabase(config.postgres);
        break;
      
      case DatabaseProvider.FIREBASE:
        if (!config.firebase) {
          throw new Error('Firebase configuration is required when using Firebase provider');
        }
        this.instance = new FirebaseDatabase(config.firebase);
        break;
      
      case DatabaseProvider.SUPABASE:
        if (!config.supabase) {
          throw new Error('Supabase configuration is required when using Supabase provider');
        }
        this.instance = new SupabaseDatabase(config.supabase);
        break;
      
      case DatabaseProvider.LOCAL:
        this.instance = new LocalDatabase(config.local || {});
        break;
      
      default:
        throw new Error(`Unsupported database provider: ${config.provider}`);
    }

    this.currentConfig = config;
    return this.instance;
  }

  /**
   * Get the current database instance
   * @returns Current database instance or null if not initialized
   */
  public static getInstance(): DatabaseOperations | null {
    return this.instance;
  }

  /**
   * Get the current database configuration
   * @returns Current database configuration or null if not initialized
   */
  public static getCurrentConfig(): DatabaseConfig | null {
    return this.currentConfig;
  }

  /**
   * Switch to a different database provider
   * This will disconnect from the current database and connect to the new one
   * @param config New database configuration
   * @returns New database operations instance
   */
  public static async switchProvider(config: DatabaseConfig): Promise<DatabaseOperations> {
    // Disconnect from the current database if it exists
    if (this.instance) {
      await this.instance.disconnect();
    }

    // Create and connect to the new database
    const newInstance = this.createDatabase(config);
    await newInstance.connect();
    
    return newInstance;
  }
}