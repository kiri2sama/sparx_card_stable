import { DatabaseMigration } from '../types';
import { Migration_001_InitialSchema } from './001_initial_schema';
import { Migration_002_AddAnalytics } from './002_add_analytics';
import { Migration_003_AddTeams } from './003_add_teams';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for the current database version
const DB_VERSION_STORAGE_KEY = 'sparx_db_version';

/**
 * List of all migrations in order
 */
const migrations: DatabaseMigration[] = [
  new Migration_001_InitialSchema(),
  new Migration_002_AddAnalytics(),
  new Migration_003_AddTeams()
];

/**
 * Database migration manager
 * Handles running migrations to update the database schema
 */
export class MigrationManager {
  /**
   * Get the current database version
   * @returns Current database version
   */
  static async getCurrentVersion(): Promise<number> {
    try {
      const versionStr = await AsyncStorage.getItem(DB_VERSION_STORAGE_KEY);
      return versionStr ? parseInt(versionStr, 10) : 0;
    } catch (error) {
      console.error('Failed to get current database version:', error);
      return 0;
    }
  }

  /**
   * Set the current database version
   * @param version New database version
   */
  static async setCurrentVersion(version: number): Promise<void> {
    try {
      await AsyncStorage.setItem(DB_VERSION_STORAGE_KEY, version.toString());
    } catch (error) {
      console.error('Failed to set current database version:', error);
      throw error;
    }
  }

  /**
   * Get the latest available migration version
   * @returns Latest migration version
   */
  static getLatestVersion(): number {
    return migrations.length > 0 ? migrations[migrations.length - 1].getVersion() : 0;
  }

  /**
   * Run all pending migrations
   * @returns Whether any migrations were run
   */
  static async migrateToLatest(): Promise<boolean> {
    const currentVersion = await this.getCurrentVersion();
    const latestVersion = this.getLatestVersion();
    
    if (currentVersion >= latestVersion) {
      console.log('Database is already at the latest version:', currentVersion);
      return false;
    }
    
    console.log(`Migrating database from version ${currentVersion} to ${latestVersion}`);
    
    // Run all migrations that are newer than the current version
    for (const migration of migrations) {
      if (migration.getVersion() > currentVersion) {
        console.log(`Running migration ${migration.getVersion()}`);
        await migration.up();
        await this.setCurrentVersion(migration.getVersion());
      }
    }
    
    console.log('Database migration completed successfully');
    return true;
  }

  /**
   * Rollback to a specific version
   * @param targetVersion Version to rollback to
   * @returns Whether any migrations were rolled back
   */
  static async rollbackToVersion(targetVersion: number): Promise<boolean> {
    const currentVersion = await this.getCurrentVersion();
    
    if (currentVersion <= targetVersion) {
      console.log(`Database is already at or below version ${targetVersion}`);
      return false;
    }
    
    console.log(`Rolling back database from version ${currentVersion} to ${targetVersion}`);
    
    // Run down migrations in reverse order
    for (let i = migrations.length - 1; i >= 0; i--) {
      const migration = migrations[i];
      if (migration.getVersion() > targetVersion && migration.getVersion() <= currentVersion) {
        console.log(`Rolling back migration ${migration.getVersion()}`);
        await migration.down();
        
        // Set the version to the previous migration, or 0 if there is none
        const newVersion = i > 0 ? migrations[i - 1].getVersion() : 0;
        await this.setCurrentVersion(newVersion);
        
        if (newVersion <= targetVersion) {
          break;
        }
      }
    }
    
    console.log('Database rollback completed successfully');
    return true;
  }
}