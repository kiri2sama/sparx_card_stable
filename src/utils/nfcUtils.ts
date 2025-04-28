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
  // Ensure all fields are strings and trim whitespace
  const sanitizedCard = {
    name: String(card.name || '').trim(),
    title: String(card.title || '').trim(),
    company: String(card.company || '').trim(),
    phone: String(card.phone || '').trim(),
    email: String(card.email || '').trim(),
    website: String(card.website || '').trim(),
    notes: String(card.notes || '').trim()
  };
  return JSON.stringify(sanitizedCard);
};

// Parse vCard format to BusinessCard
const parseVCard = (vcardText: string): BusinessCard | null => {
  try {
    const lines = vcardText.split('\n');
    const card: BusinessCard = {
      name: '',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      notes: ''
    };

    let phones: string[] = [];
    let emails: string[] = [];
    let websites: string[] = [];
    let notes: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('FN:')) {
        // Handle Arabic text in name
        card.name = decodeURIComponent(trimmedLine.substring(3).trim());
      } else if (trimmedLine.startsWith('TITLE:')) {
        card.title = decodeURIComponent(trimmedLine.substring(6).trim());
      } else if (trimmedLine.startsWith('ORG:')) {
        card.company = decodeURIComponent(trimmedLine.substring(4).trim());
      } else if (trimmedLine.startsWith('TEL;')) {
        const phone = trimmedLine.split(':')[1]?.trim();
        if (phone) phones.push(phone);
      } else if (trimmedLine.startsWith('EMAIL:')) {
        const email = trimmedLine.substring(6).trim();
        if (email) emails.push(email);
      } else if (trimmedLine.startsWith('URL:')) {
        const url = trimmedLine.substring(4).trim();
        if (url) websites.push(url);
      } else if (trimmedLine.startsWith('NOTE:')) {
        const note = decodeURIComponent(trimmedLine.substring(5).trim());
        if (note) notes.push(note);
      }
    }

    // Set primary values
    if (phones.length > 0) card.phone = phones[0];
    if (emails.length > 0) card.email = emails[0];
    if (websites.length > 0) card.website = websites[0];

    // Store additional values in notes with proper formatting
    const additionalInfo: string[] = [];
    if (phones.length > 1) {
      additionalInfo.push(`Additional phones: ${phones.slice(1).join(', ')}`);
    }
    if (emails.length > 1) {
      additionalInfo.push(`Additional emails: ${emails.slice(1).join(', ')}`);
    }
    if (websites.length > 1) {
      additionalInfo.push(`Additional websites: ${websites.slice(1).join(', ')}`);
    }
    if (notes.length > 0) {
      additionalInfo.push(...notes);
    }

    if (additionalInfo.length > 0) {
      card.notes = additionalInfo.join('\n');
    }

    return card.name ? card : null;
  } catch (error) {
    console.error('Error parsing vCard:', error);
    return null;
  }
};

// Parse a string payload back to a BusinessCard object
export const payloadToBusinessCard = (payload: string): BusinessCard | null => {
  try {
    // Log the raw payload for debugging
    console.log('Raw payload:', payload);
    console.log('Payload type:', typeof payload);
    console.log('Payload length:', payload.length);
    
    // Clean the payload string
    const cleanPayload = payload.trim();
    if (!cleanPayload) {
      console.log('Empty payload after trimming');
      return null;
    }
    
    // Log the cleaned payload
    console.log('Cleaned payload:', cleanPayload);

    // Try parsing as vCard first
    if (cleanPayload.includes('BEGIN:VCARD') || 
        cleanPayload.includes('TEL;') || 
        cleanPayload.includes('EMAIL:') ||
        cleanPayload.includes('FN:')) {
      console.log('Detected vCard format');
      return parseVCard(cleanPayload);
    }

    // Try parsing as JSON
    try {
      const parsed = JSON.parse(cleanPayload);
      console.log('Parsed data:', parsed);
      
      // Validate required fields
      if (!parsed.name) {
        console.log('Missing required name field');
        return null;
      }
      
      // Ensure all fields are strings
      const sanitizedCard = {
        name: String(parsed.name || '').trim(),
        title: String(parsed.title || '').trim(),
        company: String(parsed.company || '').trim(),
        phone: String(parsed.phone || '').trim(),
        email: String(parsed.email || '').trim(),
        website: String(parsed.website || '').trim(),
        notes: String(parsed.notes || '').trim()
      };
      
      console.log('Sanitized card:', sanitizedCard);
      return sanitizedCard;
    } catch (jsonError) {
      console.log('Not a valid JSON, trying vCard format');
      return parseVCard(cleanPayload);
    }
  } catch (error) {
    console.error('Failed to parse business card data', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
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
    if (!tag) {
      console.log('No tag found');
      return null;
    }
    
    if (!tag.ndefMessage || !tag.ndefMessage.length) {
      console.log('No NDEF message found');
      return null;
    }

    // NDEF message is an array of records, we expect our card to be in the first record
    const record = tag.ndefMessage[0];
    console.log('NDEF record:', record);
    
    // Check if this is a text/vcard record
    const recordType = new TextDecoder().decode(new Uint8Array(record.type));
    console.log('Record type:', recordType);
    
    if (recordType === 'text/vcard') {
      // For text/vcard records, we can use the payload directly
      const text = new TextDecoder('utf-8').decode(new Uint8Array(record.payload));
      console.log('Decoded vCard text:', text);
      return payloadToBusinessCard(text);
    } else {
      console.log('Unsupported record type:', recordType);
      return null;
    }
  } catch (error) {
    console.warn('Error reading NFC', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return null;
  } finally {
    cleanupNfc();
  }
};

// Convert a BusinessCard object to a vCard string
const businessCardToVCard = (card: BusinessCard): string => {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0'
  ];

  // Add name
  if (card.name) {
    lines.push(`FN:${encodeURIComponent(card.name)}`);
  }

  // Add title
  if (card.title) {
    lines.push(`TITLE:${encodeURIComponent(card.title)}`);
  }

  // Add company
  if (card.company) {
    lines.push(`ORG:${encodeURIComponent(card.company)}`);
  }

  // Add phone numbers
  if (card.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${card.phone}`);
  }

  // Add additional phones from notes
  if (card.notes) {
    const additionalPhones = card.notes.match(/Additional phones: (.*?)(?:\n|$)/);
    if (additionalPhones && additionalPhones[1]) {
      additionalPhones[1].split(',').forEach(phone => {
        lines.push(`TEL;TYPE=CELL,VOICE:${phone.trim()}`);
      });
    }
  }

  // Add email
  if (card.email) {
    lines.push(`EMAIL:${card.email}`);
  }

  // Add additional emails from notes
  if (card.notes) {
    const additionalEmails = card.notes.match(/Additional emails: (.*?)(?:\n|$)/);
    if (additionalEmails && additionalEmails[1]) {
      additionalEmails[1].split(',').forEach(email => {
        lines.push(`EMAIL:${email.trim()}`);
      });
    }
  }

  // Add website
  if (card.website) {
    lines.push(`URL:${card.website}`);
  }

  // Add additional websites from notes
  if (card.notes) {
    const additionalWebsites = card.notes.match(/Additional websites: (.*?)(?:\n|$)/);
    if (additionalWebsites && additionalWebsites[1]) {
      additionalWebsites[1].split(',').forEach(website => {
        lines.push(`URL:${website.trim()}`);
      });
    }
  }

  // Add notes (excluding the additional fields we already processed)
  if (card.notes) {
    const cleanNotes = card.notes
      .replace(/Additional phones:.*?(?:\n|$)/g, '')
      .replace(/Additional emails:.*?(?:\n|$)/g, '')
      .replace(/Additional websites:.*?(?:\n|$)/g, '')
      .trim();
    
    if (cleanNotes) {
      lines.push(`NOTE:${encodeURIComponent(cleanNotes)}`);
    }
  }

  lines.push('END:VCARD');
  return lines.join('\n');
};

// Write business card data to NFC tag
export const writeNfcTag = async (card: BusinessCard): Promise<boolean> => {
  try {
    // Validate card data before writing
    if (!card.name || card.name.trim().length === 0) {
      console.error('Invalid card data: name is required');
      return false;
    }

    // Request NFC technology
    await NfcManager.requestTechnology(NfcTech.Ndef);
    
    // Create the vCard message
    const vcard = businessCardToVCard(card);
    console.log('Writing vCard:', vcard);
    
    // Validate vCard
    if (!vcard || vcard.length === 0) {
      console.error('Invalid vCard generated');
      return false;
    }

    // Create NDEF message with text/vcard type
    const bytes = Ndef.encodeMessage([
      Ndef.record(
        Ndef.TNF_MIME_MEDIA,
        'text/vcard',
        [],
        new TextEncoder().encode(vcard)
      )
    ]);
    
    if (!bytes) {
      console.error('Failed to encode NDEF message');
      return false;
    }

    // Write to tag
    await NfcManager.ndefHandler.writeNdefMessage(bytes);
    console.log('Successfully wrote to NFC tag');
    return true;
  } catch (error) {
    console.error('Error writing to NFC tag:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return false;
  } finally {
    cleanupNfc();
  }
}; 