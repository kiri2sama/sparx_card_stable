import Contacts from 'react-native-contacts';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { BusinessCard } from '../screens/HomeScreen';

// Check and request contacts permission
export const requestContactsPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const permission = await Contacts.requestPermission();
    return permission === 'authorized';
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
    
    // Create a new contact
    const newContact = {
      givenName: card.name.split(' ')[0] || '',
      familyName: card.name.split(' ').slice(1).join(' ') || '',
      company: card.company,
      jobTitle: card.title,
      emailAddresses: emailAddresses,
      phoneNumbers: phoneNumbers,
      urlAddresses: urlAddresses,
      note: cleanNotes,
    };
    
    await Contacts.addContact(newContact);
    return true;
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
    
    const contacts = await Contacts.getAll();
    
    if (contacts.length === 0) {
      Alert.alert('No contacts found', 'Your contacts list is empty');
      return null;
    }
    
    // Normally you would show a contact picker UI here
    // For simplicity, we're just returning the first contact
    const contact = contacts[0];
    
    const businessCard: BusinessCard = {
      name: `${contact.givenName} ${contact.familyName}`.trim(),
      title: contact.jobTitle || '',
      company: contact.company || '',
      phone: contact.phoneNumbers && contact.phoneNumbers.length > 0 
        ? contact.phoneNumbers[0].number 
        : '',
      email: contact.emailAddresses && contact.emailAddresses.length > 0 
        ? contact.emailAddresses[0].email 
        : '',
      website: contact.urlAddresses && contact.urlAddresses.length > 0 
        ? contact.urlAddresses[0].url 
        : '',
      notes: contact.note || '',
    };
    
    return businessCard;
  } catch (error) {
    console.error('Error importing from contacts:', error);
    return null;
  }
}; 