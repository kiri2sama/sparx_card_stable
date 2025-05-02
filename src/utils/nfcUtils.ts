import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { BusinessCard } from '../screens/HomeScreen';
import { Alert } from 'react-native';

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
    notes: String(card.notes || '').trim(),
    additionalPhones: card.additionalPhones || [],
    additionalEmails: card.additionalEmails || [],
    additionalWebsites: card.additionalWebsites || []
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
      notes: '',
      additionalPhones: [],
      additionalEmails: [],
      additionalWebsites: []
    };

    let phones: string[] = [];
    let emails: string[] = [];
    let websites: string[] = [];
    let notes: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('FN:')) {
        // Handle text, including Arabic text in name
        try {
          const nameValue = trimmedLine.substring(3).trim();
          // Try to decode URI encoded text (common for Arabic)
          if (nameValue.includes('%')) {
            card.name = decodeURIComponent(nameValue);
          } else {
            card.name = nameValue;
          }
        } catch (e) {
          // If decoding fails, use the raw value
          card.name = trimmedLine.substring(3).trim();
        }
      } else if (trimmedLine.startsWith('TITLE:')) {
        try {
          const titleValue = trimmedLine.substring(6).trim();
          if (titleValue.includes('%')) {
            card.title = decodeURIComponent(titleValue);
          } else {
            card.title = titleValue;
          }
        } catch (e) {
          card.title = trimmedLine.substring(6).trim();
        }
      } else if (trimmedLine.startsWith('ORG:')) {
        try {
          const companyValue = trimmedLine.substring(4).trim();
          if (companyValue.includes('%')) {
            card.company = decodeURIComponent(companyValue);
          } else {
            card.company = companyValue;
          }
        } catch (e) {
          card.company = trimmedLine.substring(4).trim();
        }
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
        try {
          const noteValue = trimmedLine.substring(5).trim();
          if (noteValue.includes('%')) {
            notes.push(decodeURIComponent(noteValue));
          } else {
            notes.push(noteValue);
          }
        } catch (e) {
          notes.push(trimmedLine.substring(5).trim());
        }
      }
    }

    // Set primary values
    if (phones.length > 0) {
      card.phone = phones[0];
      // Add additional phone numbers if any
      if (phones.length > 1) {
        card.additionalPhones = phones.slice(1);
      }
    }
    
    if (emails.length > 0) {
      card.email = emails[0];
      // Add additional emails if any
      if (emails.length > 1) {
        card.additionalEmails = emails.slice(1);
      }
    }
    
    if (websites.length > 0) {
      card.website = websites[0];
      // Add additional websites if any
      if (websites.length > 1) {
        card.additionalWebsites = websites.slice(1);
      }
    }

    // Join all notes
    if (notes.length > 0) {
      card.notes = notes.join('\n');
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
        notes: String(parsed.notes || '').trim(),
        additionalPhones: parsed.additionalPhones || [],
        additionalEmails: parsed.additionalEmails || [],
        additionalWebsites: parsed.additionalWebsites || []
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

    console.log('NFC Tag detected:', tag);
    
    // Process all records to find vCard data
    for (const record of tag.ndefMessage) {
      console.log('Record type:', record.type);
      console.log('Record payload:', record.payload);
      
      // Check record type - could be MIME media record or text record
      if (record.tnf === Ndef.TNF_MIME_MEDIA) {
        // For MIME media records (e.g., text/vcard)
        const mimeType = String.fromCharCode.apply(null, record.type);
        console.log('MIME type:', mimeType);
        
        if (mimeType === 'text/vcard' || mimeType === 'text/x-vcard') {
          // Proper UTF-8 decoding for payload
          let payload = '';
          if (typeof TextDecoder !== 'undefined') {
            payload = new TextDecoder('utf-8').decode(Uint8Array.from(record.payload));
          } else {
            // Fallback for React Native environments
            payload = decodeURIComponent(escape(String.fromCharCode.apply(null, record.payload)));
          }
          console.log('Decoded vCard text:', payload);
          return payloadToBusinessCard(payload);
        }
      } 
      else if (record.tnf === Ndef.TNF_WELL_KNOWN && 
               String.fromCharCode.apply(null, record.type) === 'T') {
        // For text records - they start with a status byte followed by language code
        // Skip the language code and status byte to get the actual text
        let payload = "";
        const statusByte = record.payload[0];
        const langLength = statusByte & 0x3F;
        // Proper UTF-8 decoding for text records
        const textBytes = record.payload.slice(1 + langLength);
        if (typeof TextDecoder !== 'undefined') {
          payload = new TextDecoder('utf-8').decode(Uint8Array.from(textBytes));
        } else {
          payload = decodeURIComponent(escape(String.fromCharCode.apply(null, textBytes)));
        }
        console.log('Text payload:', payload);
        // Check if it contains vCard data
        if (payload.includes('BEGIN:VCARD') || 
            payload.includes('VCARD_PART') || 
            payload.includes('FN:')) {
          return payloadToBusinessCard(payload);
        }
      }
    }
    
    console.log('No vCard data found on tag');
    return null;
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

  // Add name - write as plain UTF-8 (no encodeURIComponent)
  if (card.name) {
    lines.push(`FN:${card.name}`);
    const nameParts = card.name.split(' ');
    if (nameParts.length > 0) {
      if (nameParts.length > 1) {
        lines.push(`N:${nameParts[nameParts.length-1]};${nameParts[0]}`);
      } else {
        lines.push(`N:;${nameParts[0]}`);
      }
    }
  }

  // Add title
  if (card.title) {
    lines.push(`TITLE:${encodeURIComponent(card.title)}`);
  }

  // Add company
  if (card.company) {
    lines.push(`ORG:${encodeURIComponent(card.company)}`);
  }

  // Add primary phone number
  if (card.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${card.phone}`);
  }

  // Add additional phone numbers
  if (card.additionalPhones && card.additionalPhones.length > 0) {
    card.additionalPhones.forEach(phone => {
      if (phone.trim()) {
        lines.push(`TEL;TYPE=CELL,VOICE:${phone.trim()}`);
      }
    });
  }

  // Add primary email
  if (card.email) {
    lines.push(`EMAIL:${card.email}`);
  }

  // Add additional emails
  if (card.additionalEmails && card.additionalEmails.length > 0) {
    card.additionalEmails.forEach(email => {
      if (email.trim()) {
        lines.push(`EMAIL:${email.trim()}`);
      }
    });
  }

  // Add primary website
  if (card.website) {
    lines.push(`URL:${card.website}`);
  }

  // Add additional websites
  if (card.additionalWebsites && card.additionalWebsites.length > 0) {
    card.additionalWebsites.forEach(website => {
      if (website.trim()) {
        lines.push(`URL:${website.trim()}`);
      }
    });
  }

  // Add notes
  if (card.notes && card.notes.trim()) {
    lines.push(`NOTE:${encodeURIComponent(card.notes.trim())}`);
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

    // Create the vCard message
    let vcard = businessCardToVCard(card);
    console.log('Writing vCard:', vcard);
    
    // Check the vCard size
    const vcardBytes = new TextEncoder().encode(vcard); // Proper UTF-8 encoding
    const vcardSize = vcardBytes.length;
    console.log('vCard size in bytes:', vcardSize);
    
    // Get tag info to check compatibility and capacity
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    console.log('Tag info:', tag);
    const tagTechTypes = tag?.techTypes || [];
    const tagType = getTagType(tagTechTypes);
    console.log('Detected tag type:', tagType);

    // Only fallback to simplified vCard if the vCard size exceeds tag.maxSize
    if (containsNonLatinChars(card.name) && tag && tag.maxSize && vcardSize > tag.maxSize) {
      console.log('Card contains non-Latin characters and vCard size exceeds tag capacity, creating simplified version');
      // Create a simplified version of the card with Latin-only characters
      const simplifiedCard = { ...card };
      simplifiedCard.name = simplifyText(card.name);
      vcard = businessCardToVCard(simplifiedCard);
      console.log('Using simplified vCard:', vcard);
      // Re-encode
      vcardBytes.set(new TextEncoder().encode(vcard));
    }

    // First, create the NDEF message - we'll try to use this with different tag types
    const mimeType = 'text/vcard';
    const mimeBytes = Array.from(mimeType).map(char => char.charCodeAt(0));
    const dataBytes = Array.from(vcardBytes); // Use UTF-8 bytes
    
    const record = Ndef.record(
      Ndef.TNF_MIME_MEDIA,
      mimeBytes,
      [],
      dataBytes
    );
    
    // Encode as NDEF message
    const ndefMessage = Ndef.encodeMessage([record]);
    if (!ndefMessage) {
      console.error('Failed to encode NDEF message');
      return false;
    }

    // Check size constraints if available
    if (tag && tag.maxSize && vcardSize > tag.maxSize) {
      console.error(`vCard size (${vcardSize} bytes) exceeds tag capacity (${tag.maxSize} bytes)`);
      Alert.alert(
        'NFC Tag Too Small',
        `The contact information is too large (${vcardSize} bytes) for this NFC tag (${tag.maxSize} bytes). Try removing some information or use a larger capacity tag.`
      );
      return false;
    }
    
    // Handle different tag types with a series of attempts
    let success = false;
    
    // Try standard NDEF first, which works for most NDEF-formatted tags
    if (tagType.isNdef) {
      try {
        // Try to write using NDEF
        console.log('Trying standard NDEF write...');
        await NfcManager.ndefHandler.writeNdefMessage(ndefMessage);
        console.log('Successfully wrote using standard NDEF');
        success = true;
      } catch (error) {
        console.error('Standard NDEF write failed:', error);
      }
    }
    
    // If standard NDEF failed and tag is formattable, try formatting
    if (!success && tagType.isFormattable) {
      try {
        // Cancel current tech and request NdefFormatable
        await NfcManager.cancelTechnologyRequest();
        await NfcManager.requestTechnology(NfcTech.NdefFormatable);
        
        console.log('Trying to format tag and write in one go...');
        await NfcManager.ndefHandler.formatNdef(ndefMessage);
        console.log('Successfully formatted tag and wrote data');
        success = true;
      } catch (error) {
        console.error('Format and write failed:', error);
      }
    }
    
    // If both attempts failed, try as plain text record
    if (!success) {
      try {
        // Start fresh
        await NfcManager.cancelTechnologyRequest();
        await NfcManager.requestTechnology(NfcTech.Ndef);
        
        // Create a simple text record instead
        console.log('Trying to write as text record...');
        const textRecord = Ndef.textRecord(vcard);
        const textMessage = Ndef.encodeMessage([textRecord]);
        
        await NfcManager.ndefHandler.writeNdefMessage(textMessage);
        console.log('Successfully wrote as text record');
        success = true;
      } catch (error) {
        console.error('Text record write failed:', error);
      }
    }
    
    // Final fallback - try with minimalist data
    if (!success) {
      try {
        // Try one last time with minimal data
        await NfcManager.cancelTechnologyRequest();
        await NfcManager.requestTechnology(NfcTech.Ndef);
        
        // Create a minimal vCard with just name and first phone
        const minimalVcard = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${card.name}`,
          card.phone ? `TEL:${card.phone}` : '',
          'END:VCARD'
        ].filter(Boolean).join('\n');
        
        console.log('Trying with minimal vCard data:', minimalVcard);
        const minimalRecord = Ndef.textRecord(minimalVcard);
        const minimalMessage = Ndef.encodeMessage([minimalRecord]);
        
        await NfcManager.ndefHandler.writeNdefMessage(minimalMessage);
        console.log('Successfully wrote minimal data');
        success = true;
      } catch (error) {
        console.error('All write attempts failed:', error);
      }
    }
    
    return success;
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

// Helper to determine tag type from techTypes array
const getTagType = (techTypes: string[]): { 
  isNdef: boolean, 
  isFormattable: boolean,
  isMifareClassic: boolean,
  isMifareUltralight: boolean
} => {
  const result = {
    isNdef: false,
    isFormattable: false,
    isMifareClassic: false,
    isMifareUltralight: false
  };
  
  for (const tech of techTypes) {
    if (tech.includes('Ndef') && !tech.includes('Formatable')) {
      result.isNdef = true;
    }
    if (tech.includes('NdefFormatable')) {
      result.isFormattable = true;
    }
    if (tech.includes('MifareClassic')) {
      result.isMifareClassic = true;
    }
    if (tech.includes('MifareUltralight')) {
      result.isMifareUltralight = true;
    }
  }
  
  return result;
};

// Helper to check if text contains non-Latin characters
const containsNonLatinChars = (text: string): boolean => {
  const nonLatinPattern = /[^\x00-\x7F]/;
  return nonLatinPattern.test(text);
};

// Helper to simplify text by removing non-Latin characters
const simplifyText = (text: string): string => {
  // Replace non-Latin with closest Latin equivalent or remove
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\x00-\x7F]/g, ''); // Remove remaining non-ASCII
};