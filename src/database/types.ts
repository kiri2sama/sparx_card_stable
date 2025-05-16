import { BusinessCard } from '../types/businessCard';

/**
 * Database provider types supported by the application
 */
export enum DatabaseProvider {
  POSTGRES = 'postgres',
  FIREBASE = 'firebase',
  SUPABASE = 'supabase',
  LOCAL = 'local'
}

/**
 * Configuration for database connections
 */
export interface DatabaseConfig {
  provider: DatabaseProvider;
  
  // PostgreSQL specific config
  postgres?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl?: boolean;
  };
  
  // Firebase specific config
  firebase?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  
  // Supabase specific config
  supabase?: {
    url: string;
    key: string;
  };
  
  // Local storage specific config
  local?: {
    encryptData?: boolean;
    encryptionKey?: string;
  };
}

/**
 * Common database operations interface
 * All database implementations must implement this interface
 */
export interface DatabaseOperations {
  // Card operations
  getCard(id: string): Promise<BusinessCard | null>;
  getCards(): Promise<BusinessCard[]>;
  saveCard(card: BusinessCard): Promise<BusinessCard>;
  updateCard(card: BusinessCard): Promise<BusinessCard>;
  deleteCard(id: string): Promise<boolean>;
  
  // User operations
  getUserCards(userId: string): Promise<BusinessCard[]>;
  
  // Team operations
  getTeamCards(teamId: string): Promise<BusinessCard[]>;
  getTeamMembers(teamId: string): Promise<any[]>;
  addTeamMember(teamId: string, member: any): Promise<any>;
  updateTeamMember(teamId: string, memberId: string, updates: any): Promise<any>;
  removeTeamMember(teamId: string, memberId: string): Promise<boolean>;
  
  // Analytics operations
  recordCardView(cardId: string, viewData: any): Promise<boolean>;
  getCardAnalytics(cardId: string): Promise<any>;
  
  // Utility operations
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  clearAllData(): Promise<boolean>; // For testing purposes
}

/**
 * Database migration interface for handling schema changes
 */
export interface DatabaseMigration {
  up(): Promise<void>;
  down(): Promise<void>;
  getVersion(): number;
}