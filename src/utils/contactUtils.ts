//src/utils/contactUtils.ts
import { Platform, PermissionsAndroid, Alert, Linking, Share } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { BusinessCard } from '../screens/HomeScreen';
import Constants from 'expo-constants';

// Check and request contacts permission
export const requestContactsPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const permission = await Contacts.requestPermissionsAsync();
    return permission.status === 'granted';
  } else if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app needs access to your contacts to save business cards.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      return false;
    }
  }
  return false;
};

// Save business card to contacts
export const saveToContacts = async (card: BusinessCard): Promise<boolean> => {
  try {
    const hasPermission = await requestContactsPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Cannot save to contacts without permission'
      );
      return false;
    }
    
    // Process multiple phone numbers
    const phoneNumbers = [];
    if (card.phone) {
      phoneNumbers.push({
        label: 'mobile',
        number: card.phone,
      });
    }
    
    // Extract additional phone numbers from notes
    if (card.notes) {
      const additionalPhones = card.notes.match(/Additional phones: (.*?)(?:\n|$)/);
      if (additionalPhones && additionalPhones[1]) {
        additionalPhones[1].split(',').forEach((phone, index) => {
          phoneNumbers.push({
            label: index === 0 ? 'work' : 'other',
            number: phone.trim(),
          });
        });
      }
    }
    
    // Process multiple email addresses
    const emailAddresses = [];
    if (card.email) {
      emailAddresses.push({
        label: 'work',
        email: card.email,
      });
    }
    
    // Extract additional emails from notes
    if (card.notes) {
      const additionalEmails = card.notes.match(/Additional emails: (.*?)(?:\n|$)/);
      if (additionalEmails && additionalEmails[1]) {
        additionalEmails[1].split(',').forEach((email, index) => {
          emailAddresses.push({
            label: index === 0 ? 'home' : 'other',
            email: email.trim(),
          });
        });
      }
    }
    
    // Process multiple URLs
    const urlAddresses = [];
    if (card.website) {
      urlAddresses.push({
        label: 'work',
        url: card.website,
      });
    }
    
    // Extract additional websites from notes
    if (card.notes) {
      const additionalWebsites = card.notes.match(/Additional websites: (.*?)(?:\n|$)/);
      if (additionalWebsites && additionalWebsites[1]) {
        additionalWebsites[1].split(',').forEach((website, index) => {
          urlAddresses.push({
            label: index === 0 ? 'home' : 'other',
            url: website.trim(),
          });
        });
      }
    }
    
    // Clean notes (remove the additional fields sections)
    let cleanNotes = card.notes || '';
    if (cleanNotes) {
      cleanNotes = cleanNotes
        .replace(/Additional phones:.*?(?:\n|$)/g, '')
        .replace(/Additional emails:.*?(?:\n|$)/g, '')
        .replace(/Additional websites:.*?(?:\n|$)/g, '')
        .trim();
    }
    
    // Creating new contacts is not supported by expo-contacts API
    Alert.alert(
      'Not Supported',
      'Saving new contacts is not supported on this platform.'
    );
    return false;
  } catch (error) {
    console.error('Error saving to contacts:', error);
    return false;
  }
};

// Import contacts to create a business card
export const importFromContacts = async (): Promise<BusinessCard | null> => {
  try {
    const hasPermission = await requestContactsPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Cannot access contacts without permission'
      );
      return null;
    }
    
    const { data: contacts } = await Contacts.getContactsAsync();
    
    if (contacts.length === 0) {
      Alert.alert('No contacts found', 'Your contacts list is empty');
      return null;
    }
    
    // Normally you would show a contact picker UI here
    // For simplicity, we're just returning the first contact
    const contact = contacts[0];
    
    // Start with basic business card
    const businessCard: BusinessCard = {
      name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
      title: contact.jobTitle || '',
      company: contact.company || '',
      phone: contact.phoneNumbers && contact.phoneNumbers.length > 0 
        ? contact.phoneNumbers[0].number 
        : '',
      email: contact.emails && contact.emails.length > 0 
        ? contact.emails[0].email 
        : '',
      website: contact.urlAddresses && contact.urlAddresses.length > 0 
        ? contact.urlAddresses[0].url 
        : '',
      notes: contact.note || '',
    };

    // Handle additional phone numbers (if any)
    if (contact.phoneNumbers && contact.phoneNumbers.length > 1) {
      const additionalPhones = contact.phoneNumbers
        .slice(1)
        .map(p => p.number)
        .filter(Boolean);
      
      if (additionalPhones.length > 0) {
        businessCard.notes += (businessCard.notes ? '\n' : '') + 
          `Additional phones: ${additionalPhones.join(', ')}`;
      }
    }

    // Handle additional emails (if any)
    if (contact.emails && contact.emails.length > 1) {
      const additionalEmails = contact.emails
        .slice(1)
        .map(e => e.email)
        .filter(Boolean);
      
      if (additionalEmails.length > 0) {
        businessCard.notes += (businessCard.notes ? '\n' : '') + 
          `Additional emails: ${additionalEmails.join(', ')}`;
      }
    }

    // Handle additional websites (if any)
    if (contact.urlAddresses && contact.urlAddresses.length > 1) {
      const additionalWebsites = contact.urlAddresses
        .slice(1)
        .map(u => u.url)
        .filter(Boolean);
      
      if (additionalWebsites.length > 0) {
        businessCard.notes += (businessCard.notes ? '\n' : '') + 
          `Additional websites: ${additionalWebsites.join(', ')}`;
      }
    }
    
    return businessCard;
  } catch (error) {
    console.error('Error importing from contacts:', error);
    return null;
  }
};

// Format a business card as a vCard string for export to contacts
const formatBusinessCardAsVCard = (card: BusinessCard): string => {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.name}`,
  ];

  // Add title if present
  if (card.title) {
    vcard.push(`TITLE:${card.title}`);
  }

  // Add company if present
  if (card.company) {
    vcard.push(`ORG:${card.company}`);
  }

  // Add primary phone
  if (card.phone) {
    vcard.push(`TEL;TYPE=CELL,VOICE:${card.phone}`);
  }

  // Add additional phones
  if (card.additionalPhones && card.additionalPhones.length > 0) {
    card.additionalPhones.forEach(phone => {
      if (phone.trim()) {
        vcard.push(`TEL;TYPE=CELL,VOICE:${phone.trim()}`);
      }
    });
  }

  // Add primary email
  if (card.email) {
    vcard.push(`EMAIL:${card.email}`);
  }

  // Add additional emails
  if (card.additionalEmails && card.additionalEmails.length > 0) {
    card.additionalEmails.forEach(email => {
      if (email.trim()) {
        vcard.push(`EMAIL:${email.trim()}`);
      }
    });
  }

  // Add primary website
  if (card.website) {
    vcard.push(`URL:${card.website}`);
  }

  // Add additional websites
  if (card.additionalWebsites && card.additionalWebsites.length > 0) {
    card.additionalWebsites.forEach(website => {
      if (website.trim()) {
        vcard.push(`URL:${website.trim()}`);
      }
    });
  }

  // Add notes if present
  if (card.notes) {
    vcard.push(`NOTE:${card.notes}`);
  }

  vcard.push('END:VCARD');
  return vcard.join('\n');
};

// Save a business card to phone contacts using platform's native contact picker
export const saveToPhoneContacts = async (card: BusinessCard): Promise<{success: boolean, contactId?: string}> => {
  try {
    // Create vCard format string
    const vCardContent = formatBusinessCardAsVCard(card);
    console.log('Formatted vCard:', vCardContent);
    
    if (Platform.OS === 'android') {
      // Create a temporary file with the vCard content
      const tempFilePath = `${FileSystem.cacheDirectory}contact.vcf`;
      
      // Write vCard content to file
      await FileSystem.writeAsStringAsync(tempFilePath, vCardContent);
      console.log('vCard saved to temp file:', tempFilePath);
      
      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(tempFilePath);
      if (!fileInfo.exists) {
        throw new Error('Failed to create temporary vCard file');
      }
      
      // Use IntentLauncher to open the vCard file with contact apps
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: tempFilePath,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: 'text/x-vcard',
      }).catch(async (error) => {
        console.log('Intent launcher failed, trying sharing API:', error);
        
        // Fallback to Sharing API if intent launcher fails
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(tempFilePath, {
            mimeType: 'text/x-vcard',
            dialogTitle: 'Save Contact',
          });
        } else {
          throw new Error('Sharing not available');
        }
      });
      
      return { success: true };
    } else if (Platform.OS === 'ios') {
      // iOS implementation - create and share vCard file
      const vCardFileName = `${FileSystem.cacheDirectory}contact.vcf`;
      await FileSystem.writeAsStringAsync(vCardFileName, vCardContent);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(vCardFileName, {
          mimeType: 'text/x-vcard',
          UTI: 'public.vcard',
        });
        return { success: true };
      } else {
        // Fallback for iOS
        const base64Content = btoa(vCardContent);
        const dataUri = `data:text/vcard;base64,${base64Content}`;
        await Linking.openURL(dataUri);
        return { success: true };
      }
    }
    
    // Fallback to basic sharing if specific methods fail
    try {
      // Create a message with contact details for sharing via text
      const nameText = card.name ? `Name: ${card.name}\n` : '';
      const titleText = card.title ? `Title: ${card.title}\n` : '';
      const companyText = card.company ? `Company: ${card.company}\n` : '';
      const phoneText = card.phone ? `Phone: ${card.phone}\n` : '';
      const emailText = card.email ? `Email: ${card.email}\n` : '';
      const websiteText = card.website ? `Website: ${card.website}\n` : '';
      const notesText = card.notes ? `Notes: ${card.notes}\n` : '';
      
      const messageText = 'Contact Information';
      const messageDetails = `${nameText}${titleText}${companyText}${phoneText}${emailText}${websiteText}${notesText}`;
      
      await Share.share({
        message: messageText + '\n' + messageDetails
      });
      
      return { success: true };
    } catch (shareError) {
      console.error('Fallback sharing also failed:', shareError);
      Alert.alert(
        'Contact Export Failed',
        'Unable to export contact. Please try again or copy the information manually.'
      );
      return { success: false };
    }
  } catch (error) {
    console.error('Contact export failed:', error);
    Alert.alert(
      'Contact Export Failed',
      'Unable to export contact. Please try again or copy the information manually.'
    );
    return { success: false };
  }
};

// Open a contact by ID
export const openContact = async (contactId: string): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL(`contacts://detail/${contactId}`);
      return true;
    } else if (Platform.OS === 'android') {
      // Android uses content:// URIs for contacts
      await Linking.openURL(`content://contacts/people/${contactId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error opening contact:', error);
    return false;
  }
};

// Open contacts settings
export const openContactsSettings = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      // Open iOS Settings app at Contacts permissions section
      await Linking.openURL('app-settings:');
      return true;
    } else if (Platform.OS === 'android') {
      // Open Android Contacts settings
      await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.SETTINGS, {
        data: 'content://com.android.contacts/contacts',
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error opening contacts settings:', error);
    return false;
  }
};

// Open contacts app
export const openContactsApp = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      // Open iOS Contacts app
      await Linking.openURL('contacts://');
      return true;
    } else if (Platform.OS === 'android') {
      // Open Android Contacts app
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: 'content://contacts/people',
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error opening contacts app:', error);
    return false;
  }
};

// Open application permissions settings
export const openAppPermissionsSettings = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      // Open iOS Settings app
      await Linking.openURL('app-settings:');
      return true;
    } else if (Platform.OS === 'android') {
      const pkg = Constants.expoConfig?.android?.package || '';
      if (!pkg) {
        console.error('Could not determine package name');
        return false;
      }
      
      // Open app details settings
      await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS, {
        data: `package:${pkg}`,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error opening app permissions settings:', error);
    return false;
  }
}; 