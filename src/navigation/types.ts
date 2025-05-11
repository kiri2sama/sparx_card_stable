import { BusinessCard } from '../screens/HomeScreen';

// Main navigation parameter list for the entire app
export type RootStackParamList = {
  Home: undefined;
  Saved: undefined;
};

// Home stack navigation parameters
export type HomeStackParamList = {
  HomeMain: undefined;
  NFCReader: undefined;
  NFCWriter: undefined;
  QRReader: undefined;
  CardView: { cardData: BusinessCard };
};

// Saved cards stack navigation parameters
export type SavedCardsStackParamList = {
  SavedCards: undefined;
  CardView: { cardData: BusinessCard };
};

// Export BusinessCard to avoid circular dependencies
export type { BusinessCard };