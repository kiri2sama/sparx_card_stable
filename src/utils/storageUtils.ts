import AsyncStorage from '@react-native-async-storage/async-storage';
import { BusinessCard } from '../types/businessCard';

const STORAGE_KEY = 'saved_business_cards';

// Get all saved business cards
export const getSavedBusinessCards = async (): Promise<BusinessCard[]> => {
  try {
    console.log('Getting saved business cards from AsyncStorage');
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('Raw AsyncStorage value:', jsonValue);
    
    if (jsonValue === null) {
      console.log('No saved cards found in storage');
      return [];
    }
    
    const cards = JSON.parse(jsonValue);
    console.log(`Retrieved ${cards.length} saved cards`);
    return cards;
  } catch (error) {
    console.error('Error getting saved business cards', error);
    return [];
  }
};

// Save a new business card
export const saveBusinessCard = async (card: BusinessCard): Promise<boolean> => {
  try {
    console.log('Saving business card:', card);
    
    // Generate a unique ID if one doesn't exist
    const cardToSave = {
      ...card,
      id: card.id || `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: card.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    
    // Get existing cards
    const existingCards = await getSavedBusinessCards();
    
    // Check if card already exists (by name and either phone or email)
    const cardExists = existingCards.some(existingCard => 
      existingCard.name === card.name && 
      (existingCard.phone === card.phone || existingCard.email === card.email)
    );
    
    if (cardExists) {
      console.log('Card already exists, not saving');
      return false;
    }
    
    // Add new card
    const updatedCards = [...existingCards, cardToSave];
    
    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    console.log('Card saved successfully');
    
    return true;
  } catch (error) {
    console.error('Error saving business card', error);
    return false;
  }
};

// Delete a business card
export const deleteBusinessCard = async (cardId: string): Promise<boolean> => {
  try {
    console.log('Deleting business card with ID:', cardId);
    
    // Get existing cards
    const existingCards = await getSavedBusinessCards();
    
    // Filter out the card to delete
    const updatedCards = existingCards.filter(card => card.id !== cardId);
    
    // If no cards were removed, the card wasn't found
    if (updatedCards.length === existingCards.length) {
      console.log('Card not found, nothing to delete');
      return false;
    }
    
    // Save updated list
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    console.log('Card deleted successfully');
    
    return true;
  } catch (error) {
    console.error('Error deleting business card', error);
    return false;
  }
};

// Update an existing business card
export const updateBusinessCard = async (updatedCard: BusinessCard): Promise<boolean> => {
  try {
    console.log('Updating business card:', updatedCard);
    
    if (!updatedCard.id) {
      console.error('Cannot update card without ID');
      return false;
    }
    
    // Get existing cards
    const existingCards = await getSavedBusinessCards();
    
    // Find the card to update
    const cardIndex = existingCards.findIndex(card => card.id === updatedCard.id);
    
    if (cardIndex === -1) {
      console.log('Card not found, cannot update');
      return false;
    }
    
    // Update the card
    const cardToUpdate = {
      ...updatedCard,
      updatedAt: Date.now()
    };
    
    existingCards[cardIndex] = cardToUpdate;
    
    // Save updated list
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingCards));
    console.log('Card updated successfully');
    
    return true;
  } catch (error) {
    console.error('Error updating business card', error);
    return false;
  }
};

// Clear all saved business cards
export const clearAllBusinessCards = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('All cards cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing business cards', error);
    return false;
  }
};