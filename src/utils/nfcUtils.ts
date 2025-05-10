import { BusinessCard } from '../types/businessCard';

/**
 * Converts a business card object to a string payload for NFC or QR code
 * @param card The business card to convert
 * @returns A string representation of the card
 */
export const businessCardToPayload = (card: BusinessCard): string => {
  // Create a simplified version of the card for the payload
  const payload = {
    name: card.name,
    title: card.title,
    company: card.company,
    phone: card.phone,
    email: card.email,
    website: card.website,
    socialProfiles: card.socialProfiles,
    id: card.id,
  };
  
  // Convert to JSON string
  return JSON.stringify(payload);
};

/**
 * Converts a vCard format string to a BusinessCard object
 * @param vcardString The vCard string to parse
 * @returns A BusinessCard object
 */
export const vcardToBusinessCard = (vcardString: string): BusinessCard => {
  const lines = vcardString.split('\r\n');
  
  const card: BusinessCard = {
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    notes: '',
    additionalPhones: [],
    additionalEmails: [],
    additionalWebsites: [],
    socialProfiles: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  let currentKey = '';
  
  lines.forEach(line => {
    if (line.startsWith('FN:')) {
      card.name = line.substring(3);
    } else if (line.startsWith('TITLE:')) {
      card.title = line.substring(6);
    } else if (line.startsWith('ORG:')) {
      card.company = line.substring(4);
    } else if (line.startsWith('TEL;') || line.startsWith('TEL:')) {
      const value = line.split(':')[1];
      if (!card.phone) {
        card.phone = value;
      } else {
        card.additionalPhones?.push(value);
      }
    } else if (line.startsWith('EMAIL;') || line.startsWith('EMAIL:')) {
      const value = line.split(':')[1];
      if (!card.email) {
        card.email = value;
      } else {
        card.additionalEmails?.push(value);
      }
    } else if (line.startsWith('URL;') || line.startsWith('URL:')) {
      const parts = line.split(':');
      const value = parts[1];
      
      if (line.includes('TYPE=')) {
        // This is a social profile
        const typeMatch = line.match(/TYPE=([^:;]+)/);
        if (typeMatch && typeMatch[1]) {
          const platform = typeMatch[1].toLowerCase();
          if (card.socialProfiles) {
            card.socialProfiles[platform] = value;
          } else {
            card.socialProfiles = { [platform]: value };
          }
        }
      } else {
        // This is a regular website
        if (!card.website) {
          card.website = value;
        } else {
          card.additionalWebsites?.push(value);
        }
      }
    } else if (line.startsWith('NOTE:')) {
      card.notes = line.substring(5);
    }
  });
  
  return card;
};

/**
 * Converts a BusinessCard object to a vCard format string
 * @param card The BusinessCard to convert
 * @returns A vCard format string
 */
export const businessCardToVcard = (card: BusinessCard): string => {
  let vcardString = 'BEGIN:VCARD\r\n';
  vcardString += 'VERSION:3.0\r\n';
  
  if (card.name) {
    vcardString += `FN:${card.name}\r\n`;
  }
  
  if (card.title) {
    vcardString += `TITLE:${card.title}\r\n`;
  }
  
  if (card.company) {
    vcardString += `ORG:${card.company}\r\n`;
  }
  
  if (card.phone) {
    vcardString += `TEL;TYPE=CELL:${card.phone}\r\n`;
  }
  
  if (card.additionalPhones && card.additionalPhones.length > 0) {
    card.additionalPhones.forEach(phone => {
      vcardString += `TEL;TYPE=WORK:${phone}\r\n`;
    });
  }
  
  if (card.email) {
    vcardString += `EMAIL:${card.email}\r\n`;
  }
  
  if (card.additionalEmails && card.additionalEmails.length > 0) {
    card.additionalEmails.forEach(email => {
      vcardString += `EMAIL:${email}\r\n`;
    });
  }
  
  if (card.website) {
    vcardString += `URL:${card.website}\r\n`;
  }
  
  if (card.additionalWebsites && card.additionalWebsites.length > 0) {
    card.additionalWebsites.forEach(website => {
      vcardString += `URL:${website}\r\n`;
    });
  }
  
  if (card.socialProfiles) {
    Object.entries(card.socialProfiles).forEach(([platform, url]) => {
      vcardString += `URL;TYPE=${platform.toUpperCase()}:${url}\r\n`;
    });
  }
  
  if (card.notes) {
    vcardString += `NOTE:${card.notes}\r\n`;
  }
  
  vcardString += 'END:VCARD';
  
  return vcardString;
};

/**
 * Parses a payload string back into a BusinessCard object
 * @param payload The payload string to parse
 * @returns A BusinessCard object
 */
export const payloadToBusinessCard = (payload: string): BusinessCard => {
  try {
    // Try to parse as JSON first
    const data = JSON.parse(payload);
    
    // Create a new BusinessCard with default values for missing fields
    const card: BusinessCard = {
      name: data.name || '',
      title: data.title || '',
      company: data.company || '',
      phone: data.phone || '',
      email: data.email || '',
      website: data.website || '',
      notes: data.notes || '',
      socialProfiles: data.socialProfiles || {},
      id: data.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    return card;
  } catch (error) {
    // If JSON parsing fails, try to parse as vCard
    if (payload.includes('BEGIN:VCARD')) {
      return vcardToBusinessCard(payload);
    }
    
    // If all parsing fails, return a minimal card
    return {
      name: 'Unknown Contact',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      notes: 'This contact could not be properly parsed.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }
};

/**
 * Generates a QR code value for a business card
 * @param card The business card to encode
 * @returns A string to be encoded in the QR code
 */
export const generateQRValue = (card: BusinessCard): string => {
  // For better compatibility, we'll use vCard format for QR codes
  return businessCardToVcard(card);
};

/**
 * Checks if the device supports NFC
 * @returns A promise that resolves to a boolean indicating NFC support
 */
export const checkNfcSupport = async (): Promise<boolean> => {
  // In a real app, this would check for NFC support
  // For now, we'll just return true
  return true;
};

/**
 * Writes a business card to an NFC tag
 * @param card The business card to write
 * @returns A promise that resolves when the write is complete
 */
export const writeNfcTag = async (card: BusinessCard): Promise<void> => {
  // In a real app, this would write to an NFC tag
  // For now, we'll just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};

/**
 * Reads a business card from an NFC tag
 * @returns A promise that resolves to a BusinessCard object
 */
export const readNfcTag = async (): Promise<BusinessCard> => {
  // In a real app, this would read from an NFC tag
  // For now, we'll just simulate a delay and return a mock card
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    name: 'John Doe',
    title: 'Software Developer',
    company: 'Tech Company',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    website: 'https://example.com',
    notes: 'Met at tech conference',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};