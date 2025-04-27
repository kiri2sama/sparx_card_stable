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
    
    // Create a new contact
    const newContact = {
      givenName: card.name.split(' ')[0] || '',
      familyName: card.name.split(' ').slice(1).join(' ') || '',
      company: card.company,
      jobTitle: card.title,
      emailAddresses: card.email ? [{
        label: 'work',
        email: card.email,
      }] : [],
      phoneNumbers: card.phone ? [{
        label: 'work',
        number: card.phone,
      }] : [],
      urlAddresses: card.website ? [{
        label: 'work',
        url: card.website,
      }] : [],
      note: card.notes,
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