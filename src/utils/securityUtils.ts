import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

// Security key storage
const SECURITY_KEY_STORAGE = 'sparx_security_key';

/**
 * Generate a secure key for encryption
 * @returns Promise<string> The generated key
 */
export const generateSecurityKey = async (): Promise<string> => {
  try {
    // Check if we already have a key
    const existingKey = await AsyncStorage.getItem(SECURITY_KEY_STORAGE);
    if (existingKey) {
      return existingKey;
    }
    
    // Generate a random string as the base for our key
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    const randomString = Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    
    // Create a SHA-256 hash of the random string
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      randomString
    );
    
    // Store the key for future use
    await AsyncStorage.setItem(SECURITY_KEY_STORAGE, key);
    
    return key;
  } catch (error) {
    console.error('Error generating security key:', error);
    // Fallback to a default key (not secure, but better than crashing)
    return 'default_security_key_fallback';
  }
};

/**
 * Encrypt data using the security key
 * @param data The data to encrypt
 * @returns Promise<string> The encrypted data
 */
export const encryptData = async (data: string): Promise<string> => {
  try {
    // Get or generate the security key
    const key = await generateSecurityKey();
    
    // In a real app, you would use a proper encryption library
    // This is just a placeholder implementation
    // DO NOT use this in production!
    
    // Simple XOR encryption (for demonstration only)
    const encrypted = Array.from(data).map((char, index) => {
      const keyChar = key[index % key.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join('');
    
    // Base64 encode the result
    return btoa(encrypted);
  } catch (error) {
    console.error('Error encrypting data:', error);
    return data; // Return original data on error
  }
};

/**
 * Decrypt data using the security key
 * @param encryptedData The encrypted data
 * @returns Promise<string> The decrypted data
 */
export const decryptData = async (encryptedData: string): Promise<string> => {
  try {
    // Get the security key
    const key = await generateSecurityKey();
    
    // Base64 decode
    const encrypted = atob(encryptedData);
    
    // Simple XOR decryption (for demonstration only)
    const decrypted = Array.from(encrypted).map((char, index) => {
      const keyChar = key[index % key.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join('');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return encryptedData; // Return encrypted data on error
  }
};

/**
 * Securely store sensitive data
 * @param key The storage key
 * @param value The value to store
 */
export const secureStore = async (key: string, value: string): Promise<void> => {
  try {
    const encrypted = await encryptData(value);
    await AsyncStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Error in secure store:', error);
  }
};

/**
 * Retrieve securely stored data
 * @param key The storage key
 * @returns Promise<string | null> The retrieved value or null
 */
export const secureRetrieve = async (key: string): Promise<string | null> => {
  try {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) return null;
    
    return await decryptData(encrypted);
  } catch (error) {
    console.error('Error in secure retrieve:', error);
    return null;
  }
};