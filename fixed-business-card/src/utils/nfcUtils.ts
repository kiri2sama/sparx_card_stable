import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { BusinessCard } from '../screens/HomeScreen';

// Initialize NFC Manager
export const initNfc = async (): Promise<boolean> => {
  try {
    await NfcManager.start();
    return await NfcManager.isSupported();
  } catch (error) {
    console.warn('NFC not supported', error);
    return false;
  }
};

// Clean up NFC resources
export const cleanupNfc = () => {
  NfcManager.cancelTechnologyRequest().catch(() => {
    // ignore errors during cleanup
  });
};

// Convert a BusinessCard object to a string payload
export const businessCardToPayload = (card: BusinessCard): string => {
  return JSON.stringify(card);
};

// Parse a string payload back to a BusinessCard object
export const payloadToBusinessCard = (payload: string): BusinessCard | null => {
  try {
    return JSON.parse(payload) as BusinessCard;
  } catch (error) {
    console.error('Failed to parse business card data', error);
    return null;
  }
};

// Read NFC tag and return business card data
export const readNfcTag = async (): Promise<BusinessCard | null> => {
  try {
    // Register for the NFC tag discovery
    await NfcManager.requestTechnology(NfcTech.Ndef);
    
    // Get the tag data
    const tag = await NfcManager.getTag();
    if (!tag) return null;
    
    if (!tag.ndefMessage || !tag.ndefMessage.length) {
      return null;
    }

    // NDEF message is an array of records, we expect our card to be in the first record
    const record = tag.ndefMessage[0];
    
    // Get the payload (assuming text record)
    const textBytes = record.payload.slice(record.payload[0] + 1); // Skip the text record header
    
    // Decode payload bytes to text
    const text = Ndef.text.decodePayload(textBytes);
    
    // Parse the JSON data
    return payloadToBusinessCard(text);
  } catch (error) {
    console.warn('Error reading NFC', error);
    return null;
  } finally {
    cleanupNfc();
  }
};

// Write business card data to NFC tag
export const writeNfcTag = async (card: BusinessCard): Promise<boolean> => {
  try {
    // Request NFC technology
    await NfcManager.requestTechnology(NfcTech.Ndef);
    
    // Create the message
    const payload = businessCardToPayload(card);
    const bytes = Ndef.encodeMessage([Ndef.textRecord(payload)]);
    
    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('Error writing to NFC tag', error);
    return false;
  } finally {
    cleanupNfc();
  }
}; 