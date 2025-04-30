import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { Alert } from 'react-native';

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

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleImportContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant contacts permission to import contacts.'
      );
      return;
    }

    // Open contact picker
    try {
      const contact = await Contacts.presentContactPickerAsync();
      
      if (!contact) {
        // User canceled
        return;
      }
      
      // Create a BusinessCard from the selected contact
      const businessCard: BusinessCard = {
        name: contact.name || '',
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
        additionalPhones: contact.phoneNumbers && contact.phoneNumbers.length > 1
          ? contact.phoneNumbers.slice(1).map(p => p.number)
          : [],
        additionalEmails: contact.emails && contact.emails.length > 1
          ? contact.emails.slice(1).map(e => e.email)
          : [],
        additionalWebsites: contact.urlAddresses && contact.urlAddresses.length > 1
          ? contact.urlAddresses.slice(1).map(u => u.url)
          : []
      };

      // Navigate to the NFCWriter screen with the imported contact
      navigation.navigate('NFCWriter' as never, { 
        editMode: true, 
        businessCard
      } as never);
    } catch (error) {
      console.error('Error importing contact:', error);
      Alert.alert('Error', 'Failed to import contact');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Business Card</Text>
      <Text style={styles.subtitle}>Save and share business cards with NFC</Text>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NFCWriter' as never)}
        >
          <Ionicons name="create-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Create New Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NFCReader' as never)}
        >
          <Ionicons name="scan-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Scan NFC Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleImportContact}
        >
          <Ionicons name="person-add-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Import Contact</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SavedCards' as never)}
        >
          <Ionicons name="bookmark-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Saved Cards</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 350,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 15,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default HomeScreen;