import AsyncStorage from '@react-native-async-storage/async-storage';
import { BusinessCard } from '../types/businessCard';

/**
 * Saves a business card to local storage
 * @param card The business card to save
 * @returns A promise that resolves to a boolean indicating success
 */
export const saveBusinessCard = async (card: BusinessCard): Promise<boolean> => {
  try {
    // Generate an ID if one doesn't exist
    const cardToSave: BusinessCard = {
      ...card,
      id: card.id || `card_${Date.now()}`,
      updatedAt: Date.now(),
    };
    
    // Get existing cards
    const existingCardsJson = await AsyncStorage.getItem('savedBusinessCards');
    const existingCards: BusinessCard[] = existingCardsJson 
      ? JSON.parse(existingCardsJson) 
      : [];
    
    // Add the new card
    existingCards.push(cardToSave);
    
    // Save back to storage
    await AsyncStorage.setItem('savedBusinessCards', JSON.stringify(existingCards));
    
    return true;
  } catch (error) {
    console.error('Error saving business card:', error);
    return false;
  }
};

/**
 * Updates an existing business card in local storage
 * @param card The business card to update
 * @returns A promise that resolves to a boolean indicating success
 */
export const updateBusinessCard = async (card: BusinessCard): Promise<boolean> => {
  try {
    if (!card.id) {
      return false;
    }
    
    // Get existing cards
    const existingCardsJson = await AsyncStorage.getItem('savedBusinessCards');
    const existingCards: BusinessCard[] = existingCardsJson 
      ? JSON.parse(existingCardsJson) 
      : [];
    
    // Find the card to update
    const cardIndex = existingCards.findIndex(c => c.id === card.id);
    
    if (cardIndex === -1) {
      return false;
    }
    
    // Update the card
    existingCards[cardIndex] = {
      ...card,
      updatedAt: Date.now(),
    };
    
    // Save back to storage
    await AsyncStorage.setItem('savedBusinessCards', JSON.stringify(existingCards));
    
    return true;
  } catch (error) {
    console.error('Error updating business card:', error);
    return false;
  }
};

/**
 * Deletes a business card from local storage
 * @param cardId The ID of the card to delete
 * @returns A promise that resolves to a boolean indicating success
 */
export const deleteBusinessCard = async (cardId: string): Promise<boolean> => {
  try {
    // Get existing cards
    const existingCardsJson = await AsyncStorage.getItem('savedBusinessCards');
    const existingCards: BusinessCard[] = existingCardsJson 
      ? JSON.parse(existingCardsJson) 
      : [];
    
    // Filter out the card to delete
    const updatedCards = existingCards.filter(card => card.id !== cardId);
    
    // Save back to storage
    await AsyncStorage.setItem('savedBusinessCards', JSON.stringify(updatedCards));
    
    return true;
  } catch (error) {
    console.error('Error deleting business card:', error);
    return false;
  }
};

/**
 * Gets all saved business cards from local storage
 * @returns A promise that resolves to an array of BusinessCard objects
 */
export const getSavedBusinessCards = async (): Promise<BusinessCard[]> => {
  try {
    const cardsJson = await AsyncStorage.getItem('savedBusinessCards');
    return cardsJson ? JSON.parse(cardsJson) : [];
  } catch (error) {
    console.error('Error getting saved business cards:', error);
    return [];
  }
};

/**
 * Gets a specific business card by ID
 * @param cardId The ID of the card to get
 * @returns A promise that resolves to a BusinessCard object or null if not found
 */
export const getBusinessCardById = async (cardId: string): Promise<BusinessCard | null> => {
  try {
    const cards = await getSavedBusinessCards();
    return cards.find(card => card.id === cardId) || null;
  } catch (error) {
    console.error('Error getting business card by ID:', error);
    return null;
  }
};

/**
 * Searches for business cards matching a query
 * @param query The search query
 * @returns A promise that resolves to an array of matching BusinessCard objects
 */
export const searchBusinessCards = async (query: string): Promise<BusinessCard[]> => {
  try {
    const cards = await getSavedBusinessCards();
    const lowerQuery = query.toLowerCase();
    
    return cards.filter(card => 
      card.name.toLowerCase().includes(lowerQuery) ||
      card.title.toLowerCase().includes(lowerQuery) ||
      card.company.toLowerCase().includes(lowerQuery) ||
      card.email.toLowerCase().includes(lowerQuery) ||
      card.phone.includes(lowerQuery) ||
      card.notes.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching business cards:', error);
    return [];
  }
};

/**
 * Updates the analytics for a business card
 * @param cardId The ID of the card to update
 * @param analyticsType The type of analytics to update (views, shares, scans)
 * @returns A promise that resolves to a boolean indicating success
 */
export const updateCardAnalytics = async (
  cardId: string, 
  analyticsType: 'views' | 'shares' | 'scans'
): Promise<boolean> => {
  try {
    // Get the card
    const card = await getBusinessCardById(cardId);
    
    if (!card) {
      return false;
    }
    
    // Update the analytics
    const updatedCard: BusinessCard = {
      ...card,
      analytics: {
        ...card.analytics,
        [analyticsType]: (card.analytics?.[analyticsType] || 0) + 1,
        lastViewed: Date.now(),
      },
    };
    
    // Save the updated card
    return updateBusinessCard(updatedCard);
  } catch (error) {
    console.error('Error updating card analytics:', error);
    return false;
  }
};

/**
 * Exports all business cards to a JSON string
 * @returns A promise that resolves to a JSON string of all cards
 */
export const exportAllCards = async (): Promise<string> => {
  try {
    const cards = await getSavedBusinessCards();
    return JSON.stringify(cards);
  } catch (error) {
    console.error('Error exporting cards:', error);
    return '';
  }
};

/**
 * Imports business cards from a JSON string
 * @param jsonString The JSON string containing business cards
 * @returns A promise that resolves to a boolean indicating success
 */
export const importCards = async (jsonString: string): Promise<boolean> => {
  try {
    const cards: BusinessCard[] = JSON.parse(jsonString);
    
    // Validate that the imported data is an array of business cards
    if (!Array.isArray(cards) || !cards.every(card => typeof card.name === 'string')) {
      return false;
    }
    
    // Save the imported cards
    await AsyncStorage.setItem('savedBusinessCards', jsonString);
    
    return true;
  } catch (error) {
    console.error('Error importing cards:', error);
    return false;
  }
};