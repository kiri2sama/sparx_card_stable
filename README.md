# NFC Business Card Implementation Guide

## Table of Contents
- [NFC Business Card Implementation Guide](#nfc-business-card-implementation-guide)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Main Components](#main-components)
  - [1. BusinessCard Interface](#1-businesscard-interface)
  - [2. NFC Writing Implementation](#2-nfc-writing-implementation)
    - [Key Functions](#key-functions)
  - [3. NFC Reading Implementation](#3-nfc-reading-implementation)
  - [4. Key Implementation Details](#4-key-implementation-details)
    - [vCard Format Standards](#vcard-format-standards)
    - [NDEF Record Structure](#ndef-record-structure)
    - [Multiple Entries Handling](#multiple-entries-handling)
    - [Character Encoding](#character-encoding)
  - [5. Function Sequence Flow](#5-function-sequence-flow)
    - [Writing Flow](#writing-flow)
    - [Reading Flow](#reading-flow)
  - [6. Usage in Other Projects](#6-usage-in-other-projects)
    - [Required Dependencies](#required-dependencies)
    - [NFC Manager Initialization](#nfc-manager-initialization)
    - [Common Challenges](#common-challenges)
  - [7. Example Usage](#7-example-usage)
  - [License](#license)
  - [Contributing](#contributing)

## Overview

This guide documents how the NFC read and write functions are implemented for the digital business card application, allowing you to save contact information to NFC tags in vCard format.

## Main Components

1. **BusinessCard Interface** - Core data structure
2. **NFC Writing** - Converting business card data to vCard and writing to NFC tags
3. **NFC Reading** - Reading vCard data from NFC tags and parsing to BusinessCard format
4. **Multiple Field Handling** - Support for multiple phone numbers, emails, and websites

## 1. BusinessCard Interface

```typescript
export type BusinessCard = {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  notes: string;
  additionalPhones?: string[];
  additionalEmails?: string[];
  additionalWebsites?: string[];
};
```

## 2. NFC Writing Implementation

### Key Functions

```typescript
// Main writing function
export const writeNfcTag = async (card: BusinessCard): Promise<boolean> => {
  try {
    // Validate data
    if (!card.name) return false;

    // Convert BusinessCard to vCard format
    const vcard = businessCardToVCard(card);
    
    // Request NFC technology access
    await NfcManager.requestTechnology(NfcTech.Ndef);

    // Convert vCard string to bytes array
    const vCardBytes = [];
    for (let i = 0; i < vcard.length; i++) {
      vCardBytes.push(vcard.charCodeAt(i));
    }
    
    // Create MIME record type bytes
    const mimeTypeBytes = [];
    const mimeType = 'text/vcard';
    for (let i = 0; i < mimeType.length; i++) {
      mimeTypeBytes.push(mimeType.charCodeAt(i));
    }
    
    // Create NDEF message
    const bytes = Ndef.encodeMessage([
      Ndef.record(
        Ndef.TNF_MIME_MEDIA,  // Type Name Format - MIME Media
        mimeTypeBytes,        // Type - 'text/vcard'
        [],                   // ID - empty
        vCardBytes            // Payload - vCard data
      )
    ]);
    
    // Write to tag
    await NfcManager.ndefHandler.writeNdefMessage(bytes);
    return true;
  } catch (error) {
    console.error('Error writing to NFC tag:', error);
    return false;
  } finally {
    cleanupNfc();
  }
};

// Convert BusinessCard to vCard format
const businessCardToVCard = (card: BusinessCard): string => {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  
  // Add basic info
  if (card.name) lines.push(`FN:${encodeURIComponent(card.name)}`);
  if (card.title) lines.push(`TITLE:${encodeURIComponent(card.title)}`);
  if (card.company) lines.push(`ORG:${encodeURIComponent(card.company)}`);
  
  // Add primary phone
  if (card.phone) lines.push(`TEL;TYPE=CELL,VOICE:${card.phone}`);
  
  // Add additional phones as separate TEL entries
  if (card.additionalPhones && card.additionalPhones.length > 0) {
    card.additionalPhones.forEach(phone => {
      if (phone.trim()) lines.push(`TEL;TYPE=CELL,VOICE:${phone.trim()}`);
    });
  }
  
  // Add primary email
  if (card.email) lines.push(`EMAIL:${card.email}`);
  
  // Add additional emails
  if (card.additionalEmails && card.additionalEmails.length > 0) {
    card.additionalEmails.forEach(email => {
      if (email.trim()) lines.push(`EMAIL:${email.trim()}`);
    });
  }
  
  // Add primary website
  if (card.website) lines.push(`URL:${card.website}`);
  
  // Add additional websites
  if (card.additionalWebsites && card.additionalWebsites.length > 0) {
    card.additionalWebsites.forEach(website => {
      if (website.trim()) lines.push(`URL:${website.trim()}`);
    });
  }
  
  // Add notes
  if (card.notes && card.notes.trim()) {
    lines.push(`NOTE:${encodeURIComponent(card.notes.trim())}`);
  }
  
  lines.push('END:VCARD');
  return lines.join('\n');
};
```

## 3. NFC Reading Implementation

```typescript
export const readNfcTag = async (): Promise<BusinessCard | null> => {
  try {
    // Request NFC technology access
    await NfcManager.requestTechnology(NfcTech.Ndef);
    
    // Get tag data
    const tag = await NfcManager.getTag();
    if (!tag?.ndefMessage?.length) return null;
    
    // Process all NDEF records on the tag
    for (const record of tag.ndefMessage) {
      // Check for MIME media records (text/vcard)
      if (record.tnf === Ndef.TNF_MIME_MEDIA) {
        const mimeType = String.fromCharCode.apply(null, record.type);
        
        if (mimeType === 'text/vcard' || mimeType === 'text/x-vcard') {
          const payload = String.fromCharCode.apply(null, record.payload);
          return payloadToBusinessCard(payload);
        }
      } 
      // Check for text records containing vCard data
      else if (record.tnf === Ndef.TNF_WELL_KNOWN && 
               String.fromCharCode.apply(null, record.type) === 'T') {
        // Text records have a status byte and language code prefix
        const statusByte = record.payload[0];
        const langLength = statusByte & 0x3F; // Get language code length
        
        // Extract the actual text, skipping status byte and language code
        const payload = String.fromCharCode.apply(
          null, 
          record.payload.slice(1 + langLength)
        );
        
        if (payload.includes('BEGIN:VCARD')) {
          return payloadToBusinessCard(payload);
        }
      }
    }
    return null;
  } catch (error) {
    console.warn('Error reading NFC:', error);
    return null;
  } finally {
    cleanupNfc();
  }
};

// Parse vCard to BusinessCard
const parseVCard = (vcardText: string): BusinessCard | null => {
  try {
    const lines = vcardText.split('\n');
    const card: BusinessCard = {
      name: '', title: '', company: '', phone: '', 
      email: '', website: '', notes: '',
      additionalPhones: [], additionalEmails: [], additionalWebsites: []
    };

    // Arrays to collect multiple entries
    let phones = [], emails = [], websites = [], notes = [];

    // Process each line of the vCard
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('FN:')) {
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

    // Assign the first phone as primary, rest as additional
    if (phones.length > 0) {
      card.phone = phones[0];
      if (phones.length > 1) {
        card.additionalPhones = phones.slice(1);
      }
    }
    
    // Assign the first email as primary, rest as additional
    if (emails.length > 0) {
      card.email = emails[0];
      if (emails.length > 1) {
        card.additionalEmails = emails.slice(1);
      }
    }
    
    // Assign the first website as primary, rest as additional
    if (websites.length > 0) {
      card.website = websites[0];
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
```

## 4. Key Implementation Details

### vCard Format Standards

vCard 3.0 format is used with the following structure:
```
BEGIN:VCARD
VERSION:3.0
FN:Person Name
TITLE:Job Title
ORG:Company Name
TEL;TYPE=CELL,VOICE:1234567890
EMAIL:email@example.com
URL:https://example.com
NOTE:Additional notes
END:VCARD
```

### NDEF Record Structure

1. **Type Name Format (TNF)**: `Ndef.TNF_MIME_MEDIA` (2)
2. **Type**: `text/vcard` (MIME type for vCards)
3. **ID**: Empty array
4. **Payload**: The actual vCard data as a byte array

### Multiple Entries Handling

Multiple phone numbers, emails, and websites are handled in two ways:
1. In the UI: Multiple input fields generated dynamically
2. In the data: First entry is stored as primary, additional entries in dedicated arrays

### Character Encoding

- For names, titles, company names, and notes: Use `encodeURIComponent()` when writing and `decodeURIComponent()` when reading
- This ensures proper handling of special characters, including non-English alphabets

## 5. Function Sequence Flow

This section illustrates the sequence of function calls and data flow during NFC operations.

### Writing Flow

```
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│                 │     │                       │     │                     │
│ UI Input Fields │────▶│ BusinessCard Object   │────▶│ writeNfcTag()       │
│                 │     │ (with multiple fields)│     │                     │
└─────────────────┘     └───────────────────────┘     └──────────┬──────────┘
                                                                  │
                                                                  ▼
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│                 │     │                       │     │                     │
│ NFC Tag Written │◀────│ NDEF Message Created  │◀────│ businessCardToVCard()│
│                 │     │                       │     │                     │
└─────────────────┘     └───────────────────────┘     └─────────────────────┘
```

**Detailed Sequence:**

1. User enters data in the UI (name, title, company, phone numbers, emails, websites, notes)
2. A BusinessCard object is created with primary fields and additional arrays
3. `writeNfcTag(card)` is called with this BusinessCard object
4. Inside writeNfcTag:
   - `businessCardToVCard(card)` converts the BusinessCard to vCard format
   - NFC technology is requested with `NfcManager.requestTechnology()`
   - vCard data is converted to bytes
   - NDEF record is created with MIME type 'text/vcard'
   - NDEF message is encoded and written to the tag
5. Clean-up is performed using `cleanupNfc()`

### Reading Flow

```
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│                 │     │                       │     │                     │
│ NFC Tag Detected│────▶│ readNfcTag()          │────▶│ Tag NDEF Records   │
│                 │     │                       │     │                     │
└─────────────────┘     └───────────────────────┘     └──────────┬──────────┘
                                                                  │
                                                                  ▼
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────┐
│                 │     │                       │     │                     │
│ UI Display      │◀────│ BusinessCard Object   │◀────│ parseVCard() or     │
│                 │     │                       │     │ payloadToBusinessCard│
└─────────────────┘     └───────────────────────┘     └─────────────────────┘
```

**Detailed Sequence:**

1. NFC tag is detected by the device
2. `readNfcTag()` is called to access the tag
3. NFC technology is requested with `NfcManager.requestTechnology()`
4. Tag data is retrieved with `NfcManager.getTag()`
5. Each NDEF record on the tag is examined:
   - For MIME records with 'text/vcard' type:
     - Data is extracted and passed to `payloadToBusinessCard()`
   - For text records containing vCard data:
     - Text is extracted, skipping language code and status byte
     - Data is passed to `payloadToBusinessCard()`
6. Inside `payloadToBusinessCard()`:
   - If data is in vCard format, `parseVCard()` is called
   - `parseVCard()` processes each line of the vCard:
     - Extracts name, title, company from encoded values
     - Collects all phone numbers, emails, websites
     - First item of each type becomes primary
     - Additional items are stored in respective arrays
7. BusinessCard object is returned and displayed in the UI
8. Clean-up is performed using `cleanupNfc()`

## 6. Usage in Other Projects

### Required Dependencies

```json
"react-native-nfc-manager": "^3.14.4"
```

### NFC Manager Initialization

```typescript
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Initialize NFC
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
```

### Common Challenges

1. **Buffer Not Available**: React Native doesn't include Node's Buffer. Convert strings to byte arrays manually:
   ```typescript
   const bytes = [];
   for (let i = 0; i < string.length; i++) {
     bytes.push(string.charCodeAt(i));
   }
   ```

2. **Non-Latin Character Support**: Use encodeURIComponent/decodeURIComponent for proper encoding.

3. **Multiple Records**: When reading, check all records on a tag as some writers split data into multiple records.

## 7. Example Usage

```typescript
// Writing example
const writeExample = async () => {
  const businessCard: BusinessCard = {
    name: "John Doe",
    title: "Software Engineer",
    company: "Tech Corp",
    phone: "1234567890",
    email: "john@example.com",
    website: "https://johndoe.com",
    notes: "Available for consulting",
    additionalPhones: ["0987654321"],
    additionalEmails: ["john.work@example.com"],
    additionalWebsites: ["https://github.com/johndoe"]
  };
  
  const success = await writeNfcTag(businessCard);
  console.log(`Write ${success ? 'succeeded' : 'failed'}`);
};

// Reading example
const readExample = async () => {
  const businessCard = await readNfcTag();
  if (businessCard) {
    console.log("Card read successfully:", businessCard);
  } else {
    console.log("Failed to read card");
  }
};
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.