import AsyncStorage from '@react-native-async-storage/async-storage';
import { BusinessCard } from '../screens/HomeScreen';

const STORAGE_KEY = 'saved_business_cards';

// Get all saved business cards
export const getSavedBusinessCards = async (): Promise<BusinessCard[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting saved business cards', error);
    return [];
  }
};

// Save a new business card
export const saveBusinessCard = async (card: BusinessCard): Promise<boolean> => {
  try {
    // Get existing cards
    const existingCards = await getSavedBusinessCards();
    
    // Check if card with same name and email already exists
    const cardExists = existingCards.some(
      existingCard => 
        existingCard.name === card.name && 
        existingCard.email === card.email
    );
    
    if (cardExists) {
      return false; // Card already exists
    }
    
    // Add new card
    const updatedCards = [...existingCards, card];
    
    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    return true;
  } catch (error) {
    console.error('Error saving business card', error);
    return false;
  }
};

// Delete a business card
export const deleteBusinessCard = async (index: number): Promise<boolean> => {
  try {
    const existingCards = await getSavedBusinessCards();
    
    if (index < 0 || index >= existingCards.length) {
      return false; // Invalid index
    }
    
    // Remove the card at the specified index
    existingCards.splice(index, 1);
    
    // Save updated cards
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingCards));
    return true;
  } catch (error) {
    console.error('Error deleting business card', error);
    return false;
  }
};

// Update an existing business card
export const updateBusinessCard = async (index: number, updatedCard: BusinessCard): Promise<boolean> => {
  try {
    const existingCards = await getSavedBusinessCards();
    
    if (index < 0 || index >= existingCards.length) {
      return false; // Invalid index
    }
    
    // Update the card at the specified index
    existingCards[index] = updatedCard;
    
    // Save updated cards
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingCards));
    return true;
  } catch (error) {
    console.error('Error updating business card', error);
    return false;
  }
}; 