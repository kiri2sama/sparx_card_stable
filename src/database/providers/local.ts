import { DatabaseOperations } from '../types';
import { BusinessCard } from '../../types/businessCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Local database configuration
 */
export interface LocalDatabaseConfig {
  encryptData?: boolean;
  encryptionKey?: string;
}

/**
 * Storage keys for different data types
 */
const STORAGE_KEYS = {
  BUSINESS_CARDS: 'sparx_business_cards',
  TEAM_MEMBERS: 'sparx_team_members',
  CARD_VIEWS: 'sparx_card_views',
};

/**
 * Local database implementation using AsyncStorage
 */
export class LocalDatabase implements DatabaseOperations {
  private config: LocalDatabaseConfig;
  private connected: boolean = false;
  
  // In-memory cache to reduce AsyncStorage reads
  private cardsCache: BusinessCard[] | null = null;
  private teamMembersCache: Record<string, any[]> = {};
  private cardViewsCache: Record<string, any[]> = {};

  constructor(config: LocalDatabaseConfig = {}) {
    this.config = config;
  }

  /**
   * Connect to the local database (AsyncStorage)
   */
  async connect(): Promise<boolean> {
    try {
      // AsyncStorage doesn't need an explicit connection,
      // but we'll check if it's available
      await AsyncStorage.getItem('test_connection');
      this.connected = true;
      console.log('Connected to local database (AsyncStorage)');
      return true;
    } catch (error) {
      console.error('Failed to connect to local database:', error);
      this.connected = false;
      throw error;
    }
  }

  /**
   * Disconnect from the local database
   */
  async disconnect(): Promise<void> {
    // Clear caches
    this.cardsCache = null;
    this.teamMembersCache = {};
    this.cardViewsCache = {};
    this.connected = false;
    console.log('Disconnected from local database');
  }

  /**
   * Check if connected to the local database
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get a business card by ID
   * @param id Card ID
   */
  async getCard(id: string): Promise<BusinessCard | null> {
    this.ensureConnected();
    
    try {
      // Load all cards if not cached
      if (!this.cardsCache) {
        await this.loadCards();
      }
      
      // Find the card with the matching ID
      const card = this.cardsCache?.find(card => card.id === id) || null;
      return card;
    } catch (error) {
      console.error('Failed to get card from local database:', error);
      throw error;
    }
  }

  /**
   * Get all business cards
   */
  async getCards(): Promise<BusinessCard[]> {
    this.ensureConnected();
    
    try {
      // Load all cards if not cached
      if (!this.cardsCache) {
        await this.loadCards();
      }
      
      return this.cardsCache || [];
    } catch (error) {
      console.error('Failed to get cards from local database:', error);
      throw error;
    }
  }

  /**
   * Save a new business card
   * @param card Business card to save
   */
  async saveCard(card: BusinessCard): Promise<BusinessCard> {
    this.ensureConnected();
    
    try {
      // Load all cards if not cached
      if (!this.cardsCache) {
        await this.loadCards();
      }
      
      // Ensure the card has an ID
      const cardToSave = {
        ...card,
        id: card.id || `card_${Date.now()}`,
        createdAt: card.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      
      // Add the card to the cache
      this.cardsCache = [...(this.cardsCache || []), cardToSave];
      
      // Save the updated cache to AsyncStorage
      await this.saveCards();
      
      console.log('Saved card to local database:', cardToSave.id);
      return cardToSave;
    } catch (error) {
      console.error('Failed to save card to local database:', error);
      throw error;
    }
  }

  /**
   * Update an existing business card
   * @param card Business card to update
   */
  async updateCard(card: BusinessCard): Promise<BusinessCard> {
    this.ensureConnected();
    
    try {
      // Load all cards if not cached
      if (!this.cardsCache) {
        await this.loadCards();
      }
      
      const cardToUpdate = {
        ...card,
        updatedAt: Date.now()
      };
      
      // Update the card in the cache
      this.cardsCache = (this.cardsCache || []).map(c => 
        c.id === cardToUpdate.id ? cardToUpdate : c
      );
      
      // Save the updated cache to AsyncStorage
      await this.saveCards();
      
      console.log('Updated card in local database:', cardToUpdate.id);
      return cardToUpdate;
    } catch (error) {
      console.error('Failed to update card in local database:', error);
      throw error;
    }
  }

  /**
   * Delete a business card by ID
   * @param id Card ID to delete
   */
  async deleteCard(id: string): Promise<boolean> {
    this.ensureConnected();
    
    try {
      // Load all cards if not cached
      if (!this.cardsCache) {
        await this.loadCards();
      }
      
      // Remove the card from the cache
      const initialLength = this.cardsCache?.length || 0;
      this.cardsCache = (this.cardsCache || []).filter(c => c.id !== id);
      
      // Check if a card was actually removed
      const cardRemoved = initialLength > (this.cardsCache?.length || 0);
      
      if (cardRemoved) {
        // Save the updated cache to AsyncStorage
        await this.saveCards();
        console.log('Deleted card from local database:', id);
      }
      
      return cardRemoved;
    } catch (error) {
      console.error('Failed to delete card from local database:', error);
      throw error;
    }
  }

  /**
   * Get all cards for a specific user
   * @param userId User ID
   */
  async getUserCards(userId: string): Promise<BusinessCard[]> {
    this.ensureConnected();
    
    try {
      // Load all cards if not cached
      if (!this.cardsCache) {
        await this.loadCards();
      }
      
      // Filter cards by user ID
      return (this.cardsCache || []).filter(card => card.userId === userId);
    } catch (error) {
      console.error('Failed to get user cards from local database:', error);
      throw error;
    }
  }

  /**
   * Get all cards for a specific team
   * @param teamId Team ID
   */
  async getTeamCards(teamId: string): Promise<BusinessCard[]> {
    this.ensureConnected();
    
    try {
      // Load all cards if not cached
      if (!this.cardsCache) {
        await this.loadCards();
      }
      
      // Filter cards by team ID
      return (this.cardsCache || []).filter(card => card.teamId === teamId);
    } catch (error) {
      console.error('Failed to get team cards from local database:', error);
      throw error;
    }
  }

  /**
   * Get all members of a specific team
   * @param teamId Team ID
   */
  async getTeamMembers(teamId: string): Promise<any[]> {
    this.ensureConnected();
    
    try {
      // Load team members if not cached
      if (!this.teamMembersCache[teamId]) {
        await this.loadTeamMembers(teamId);
      }
      
      return this.teamMembersCache[teamId] || [];
    } catch (error) {
      console.error('Failed to get team members from local database:', error);
      throw error;
    }
  }

  /**
   * Add a new member to a team
   * @param teamId Team ID
   * @param member Member data to add
   */
  async addTeamMember(teamId: string, member: any): Promise<any> {
    this.ensureConnected();
    
    try {
      // Load team members if not cached
      if (!this.teamMembersCache[teamId]) {
        await this.loadTeamMembers(teamId);
      }
      
      const memberToAdd = {
        ...member,
        id: member.id || `member_${Date.now()}`,
        teamId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Add the member to the cache
      this.teamMembersCache[teamId] = [
        ...(this.teamMembersCache[teamId] || []),
        memberToAdd
      ];
      
      // Save the updated cache to AsyncStorage
      await this.saveTeamMembers(teamId);
      
      console.log('Added team member to local database:', memberToAdd.id);
      return memberToAdd;
    } catch (error) {
      console.error('Failed to add team member to local database:', error);
      throw error;
    }
  }

  /**
   * Update an existing team member
   * @param teamId Team ID
   * @param memberId Member ID to update
   * @param updates Updates to apply
   */
  async updateTeamMember(teamId: string, memberId: string, updates: any): Promise<any> {
    this.ensureConnected();
    
    try {
      // Load team members if not cached
      if (!this.teamMembersCache[teamId]) {
        await this.loadTeamMembers(teamId);
      }
      
      const updatedMember = {
        ...updates,
        id: memberId,
        teamId,
        updatedAt: Date.now()
      };
      
      // Update the member in the cache
      this.teamMembersCache[teamId] = (this.teamMembersCache[teamId] || []).map(m => 
        m.id === memberId ? updatedMember : m
      );
      
      // Save the updated cache to AsyncStorage
      await this.saveTeamMembers(teamId);
      
      console.log('Updated team member in local database:', memberId);
      return updatedMember;
    } catch (error) {
      console.error('Failed to update team member in local database:', error);
      throw error;
    }
  }

  /**
   * Remove a member from a team
   * @param teamId Team ID
   * @param memberId Member ID to remove
   */
  async removeTeamMember(teamId: string, memberId: string): Promise<boolean> {
    this.ensureConnected();
    
    try {
      // Load team members if not cached
      if (!this.teamMembersCache[teamId]) {
        await this.loadTeamMembers(teamId);
      }
      
      // Remove the member from the cache
      const initialLength = this.teamMembersCache[teamId]?.length || 0;
      this.teamMembersCache[teamId] = (this.teamMembersCache[teamId] || []).filter(m => m.id !== memberId);
      
      // Check if a member was actually removed
      const memberRemoved = initialLength > (this.teamMembersCache[teamId]?.length || 0);
      
      if (memberRemoved) {
        // Save the updated cache to AsyncStorage
        await this.saveTeamMembers(teamId);
        console.log('Removed team member from local database:', memberId);
      }
      
      return memberRemoved;
    } catch (error) {
      console.error('Failed to remove team member from local database:', error);
      throw error;
    }
  }

  /**
   * Record a view of a business card
   * @param cardId Card ID
   * @param viewData View data to record
   */
  async recordCardView(cardId: string, viewData: any): Promise<boolean> {
    this.ensureConnected();
    
    try {
      // Load card views if not cached
      if (!this.cardViewsCache[cardId]) {
        await this.loadCardViews(cardId);
      }
      
      const viewToRecord = {
        ...viewData,
        id: `view_${Date.now()}`,
        cardId,
        timestamp: Date.now()
      };
      
      // Add the view to the cache
      this.cardViewsCache[cardId] = [
        ...(this.cardViewsCache[cardId] || []),
        viewToRecord
      ];
      
      // Save the updated cache to AsyncStorage
      await this.saveCardViews(cardId);
      
      console.log('Recorded card view in local database:', cardId);
      return true;
    } catch (error) {
      console.error('Failed to record card view in local database:', error);
      throw error;
    }
  }

  /**
   * Get analytics for a specific card
   * @param cardId Card ID
   */
  async getCardAnalytics(cardId: string): Promise<any> {
    this.ensureConnected();
    
    try {
      // Load card views if not cached
      if (!this.cardViewsCache[cardId]) {
        await this.loadCardViews(cardId);
      }
      
      const views = this.cardViewsCache[cardId] || [];
      
      // Calculate analytics
      const totalViews = views.length;
      const uniqueVisitors = new Set(views.map(view => view.ipAddress || view.deviceId)).size;
      
      // Group views by referrer
      const referrers = views.reduce((acc: Record<string, number>, view) => {
        const referrer = view.referrer || 'Direct';
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      }, {});
      
      const referrersList = Object.entries(referrers).map(([source, count]) => ({
        source,
        count
      })).sort((a, b) => b.count - a.count);
      
      // Group views by date
      const timeline = views.reduce((acc: Record<string, number>, view) => {
        const date = new Date(view.timestamp).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      
      const timelineList = Object.entries(timeline).map(([date, views]) => ({
        date,
        views
      })).sort((a, b) => a.date.localeCompare(b.date));
      
      // Group views by location
      const locations = views.reduce((acc: Record<string, number>, view) => {
        const country = view.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});
      
      const locationsList = Object.entries(locations).map(([country, count]) => ({
        country,
        count
      })).sort((a, b) => b.count - a.count);
      
      return {
        totalViews,
        uniqueVisitors,
        referrers: referrersList,
        timeline: timelineList,
        locations: locationsList
      };
    } catch (error) {
      console.error('Failed to get card analytics from local database:', error);
      throw error;
    }
  }

  /**
   * Clear all data (for testing purposes)
   */
  async clearAllData(): Promise<boolean> {
    this.ensureConnected();
    
    try {
      // Clear all data from AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.BUSINESS_CARDS,
        STORAGE_KEYS.TEAM_MEMBERS,
        STORAGE_KEYS.CARD_VIEWS
      ]);
      
      // Clear caches
      this.cardsCache = [];
      this.teamMembersCache = {};
      this.cardViewsCache = {};
      
      console.log('Cleared all data from local database');
      return true;
    } catch (error) {
      console.error('Failed to clear data from local database:', error);
      throw error;
    }
  }

  /**
   * Load all business cards from AsyncStorage
   */
  private async loadCards(): Promise<void> {
    try {
      const cardsJson = await AsyncStorage.getItem(STORAGE_KEYS.BUSINESS_CARDS);
      this.cardsCache = cardsJson ? JSON.parse(cardsJson) : [];
    } catch (error) {
      console.error('Failed to load cards from AsyncStorage:', error);
      this.cardsCache = [];
      throw error;
    }
  }

  /**
   * Save all business cards to AsyncStorage
   */
  private async saveCards(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.BUSINESS_CARDS,
        JSON.stringify(this.cardsCache)
      );
    } catch (error) {
      console.error('Failed to save cards to AsyncStorage:', error);
      throw error;
    }
  }

  /**
   * Load team members for a specific team from AsyncStorage
   * @param teamId Team ID
   */
  private async loadTeamMembers(teamId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.TEAM_MEMBERS}_${teamId}`;
      const membersJson = await AsyncStorage.getItem(key);
      this.teamMembersCache[teamId] = membersJson ? JSON.parse(membersJson) : [];
    } catch (error) {
      console.error('Failed to load team members from AsyncStorage:', error);
      this.teamMembersCache[teamId] = [];
      throw error;
    }
  }

  /**
   * Save team members for a specific team to AsyncStorage
   * @param teamId Team ID
   */
  private async saveTeamMembers(teamId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.TEAM_MEMBERS}_${teamId}`;
      await AsyncStorage.setItem(
        key,
        JSON.stringify(this.teamMembersCache[teamId])
      );
    } catch (error) {
      console.error('Failed to save team members to AsyncStorage:', error);
      throw error;
    }
  }

  /**
   * Load card views for a specific card from AsyncStorage
   * @param cardId Card ID
   */
  private async loadCardViews(cardId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.CARD_VIEWS}_${cardId}`;
      const viewsJson = await AsyncStorage.getItem(key);
      this.cardViewsCache[cardId] = viewsJson ? JSON.parse(viewsJson) : [];
    } catch (error) {
      console.error('Failed to load card views from AsyncStorage:', error);
      this.cardViewsCache[cardId] = [];
      throw error;
    }
  }

  /**
   * Save card views for a specific card to AsyncStorage
   * @param cardId Card ID
   */
  private async saveCardViews(cardId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.CARD_VIEWS}_${cardId}`;
      await AsyncStorage.setItem(
        key,
        JSON.stringify(this.cardViewsCache[cardId])
      );
    } catch (error) {
      console.error('Failed to save card views to AsyncStorage:', error);
      throw error;
    }
  }

  /**
   * Ensure that we are connected to the database
   * @throws Error if not connected
   */
  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Not connected to local database');
    }
  }
}