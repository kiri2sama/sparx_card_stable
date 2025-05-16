import { BusinessCard } from '../types/businessCard';
import { useDatabase } from './context';
import { MigrationManager } from './migrations';

/**
 * Database service
 * Provides a simpler API for the application to interact with the database
 */
export const useDatabaseService = () => {
  const { db, isLoading, error } = useDatabase();

  /**
   * Run database migrations
   */
  const runMigrations = async (): Promise<boolean> => {
    return await MigrationManager.migrateToLatest();
  };

  /**
   * Get the current database version
   */
  const getDatabaseVersion = async (): Promise<number> => {
    return await MigrationManager.getCurrentVersion();
  };

  /**
   * Get a business card by ID
   * @param id Card ID
   */
  const getCard = async (id: string): Promise<BusinessCard | null> => {
    if (!db) throw new Error('Database not initialized');
    return await db.getCard(id);
  };

  /**
   * Get all business cards
   */
  const getCards = async (): Promise<BusinessCard[]> => {
    if (!db) throw new Error('Database not initialized');
    return await db.getCards();
  };

  /**
   * Save a new business card
   * @param card Business card to save
   */
  const saveCard = async (card: BusinessCard): Promise<BusinessCard> => {
    if (!db) throw new Error('Database not initialized');
    return await db.saveCard(card);
  };

  /**
   * Update an existing business card
   * @param card Business card to update
   */
  const updateCard = async (card: BusinessCard): Promise<BusinessCard> => {
    if (!db) throw new Error('Database not initialized');
    return await db.updateCard(card);
  };

  /**
   * Delete a business card by ID
   * @param id Card ID to delete
   */
  const deleteCard = async (id: string): Promise<boolean> => {
    if (!db) throw new Error('Database not initialized');
    return await db.deleteCard(id);
  };

  /**
   * Get all cards for a specific user
   * @param userId User ID
   */
  const getUserCards = async (userId: string): Promise<BusinessCard[]> => {
    if (!db) throw new Error('Database not initialized');
    return await db.getUserCards(userId);
  };

  /**
   * Get all cards for a specific team
   * @param teamId Team ID
   */
  const getTeamCards = async (teamId: string): Promise<BusinessCard[]> => {
    if (!db) throw new Error('Database not initialized');
    return await db.getTeamCards(teamId);
  };

  /**
   * Get all members of a specific team
   * @param teamId Team ID
   */
  const getTeamMembers = async (teamId: string): Promise<any[]> => {
    if (!db) throw new Error('Database not initialized');
    return await db.getTeamMembers(teamId);
  };

  /**
   * Add a new member to a team
   * @param teamId Team ID
   * @param member Member data to add
   */
  const addTeamMember = async (teamId: string, member: any): Promise<any> => {
    if (!db) throw new Error('Database not initialized');
    return await db.addTeamMember(teamId, member);
  };

  /**
   * Update an existing team member
   * @param teamId Team ID
   * @param memberId Member ID to update
   * @param updates Updates to apply
   */
  const updateTeamMember = async (
    teamId: string,
    memberId: string,
    updates: any
  ): Promise<any> => {
    if (!db) throw new Error('Database not initialized');
    return await db.updateTeamMember(teamId, memberId, updates);
  };

  /**
   * Remove a member from a team
   * @param teamId Team ID
   * @param memberId Member ID to remove
   */
  const removeTeamMember = async (
    teamId: string,
    memberId: string
  ): Promise<boolean> => {
    if (!db) throw new Error('Database not initialized');
    return await db.removeTeamMember(teamId, memberId);
  };

  /**
   * Record a view of a business card
   * @param cardId Card ID
   * @param viewData View data to record
   */
  const recordCardView = async (
    cardId: string,
    viewData: any
  ): Promise<boolean> => {
    if (!db) throw new Error('Database not initialized');
    return await db.recordCardView(cardId, viewData);
  };

  /**
   * Get analytics for a specific card
   * @param cardId Card ID
   */
  const getCardAnalytics = async (cardId: string): Promise<any> => {
    if (!db) throw new Error('Database not initialized');
    return await db.getCardAnalytics(cardId);
  };

  return {
    // Database status
    isLoading,
    error,
    
    // Migration functions
    runMigrations,
    getDatabaseVersion,
    
    // Card operations
    getCard,
    getCards,
    saveCard,
    updateCard,
    deleteCard,
    
    // User operations
    getUserCards,
    
    // Team operations
    getTeamCards,
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    
    // Analytics operations
    recordCardView,
    getCardAnalytics,
  };
};