import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BusinessCard } from './HomeScreen';
import { saveBusinessCard } from '../utils/storageUtils';
import { saveToContacts } from '../utils/contactUtils';
import { Ionicons } from '@expo/vector-icons';

type ImportOptionsScreenParams = {
  cardData: BusinessCard;
};

const ImportOptionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cardData } = route.params as ImportOptionsScreenParams;
  
  const [additionalPhones, setAdditionalPhones] = useState<string[]>([]);
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [additionalWebsites, setAdditionalWebsites] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  // Extract additional information from notes
  useEffect(() => {
    if (cardData.notes) {
      let tempNotes = cardData.notes;
      
      // Extract phone numbers
      const phonesMatch = tempNotes.match(/Additional phones: (.*?)(?:\n|$)/);
      if (phonesMatch && phonesMatch[1]) {
        setAdditionalPhones(phonesMatch[1].split(',').map(p => p.trim()));
        tempNotes = tempNotes.replace(/Additional phones:.*?(?:\n|$)/g, '');
      }
      
      // Extract emails
      const emailsMatch = tempNotes.match(/Additional emails: (.*?)(?:\n|$)/);
      if (emailsMatch && emailsMatch[1]) {
        setAdditionalEmails(emailsMatch[1].split(',').map(e => e.trim()));
        tempNotes = tempNotes.replace(/Additional emails:.*?(?:\n|$)/g, '');
      }
      
      // Extract websites
      const websitesMatch = tempNotes.match(/Additional websites: (.*?)(?:\n|$)/);
      if (websitesMatch && websitesMatch[1]) {
        setAdditionalWebsites(websitesMatch[1].split(',').map(w => w.trim()));
        tempNotes = tempNotes.replace(/Additional websites:.*?(?:\n|$)/g, '');
      }
      
      // Set cleaned notes
      setNotes(tempNotes.trim());
    }
  }, [cardData.notes]);

  const handleSaveToContacts = async () => {
    try {
      const success = await saveToContacts(cardData);
      if (success) {
        Alert.alert(
          'Success',
          'Business card saved to contacts',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to save business card to contacts',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving to contacts:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while saving to contacts',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSaveToApp = async () => {
    try {
      const success = await saveBusinessCard(cardData);
      if (success) {
        Alert.alert(
          'Success',
          'Business card saved to app',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Already Saved',
          'This business card is already in your saved cards',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving to app:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while saving to app',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSaveToBoth = async () => {
    try {
      const [contactsSuccess, appSuccess] = await Promise.all([
        saveToContacts(cardData),
        saveBusinessCard(cardData)
      ]);

      if (contactsSuccess && appSuccess) {
        Alert.alert(
          'Success',
          'Business card saved to both contacts and app',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Partial Success',
          'Business card was saved to some locations but not all',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error saving to both:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while saving',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import Business Card</Text>
      <Text style={styles.subtitle}>Choose where to save this business card</Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.cardPreview}>
          <Text style={styles.cardName}>{cardData.name}</Text>
          
          {cardData.title ? (
            <Text style={styles.cardDetail}>{cardData.title}</Text>
          ) : null}
          
          {cardData.company ? (
            <Text style={styles.cardDetail}><Ionicons name="business-outline" size={16} color="#666" /> {cardData.company}</Text>
          ) : null}
          
          {cardData.phone ? (
            <Text style={styles.cardDetail}><Ionicons name="call-outline" size={16} color="#666" /> {cardData.phone}</Text>
          ) : null}
          
          {additionalPhones.map((phone, index) => (
            <Text key={`phone-${index}`} style={styles.cardDetail}>
              <Ionicons name="call-outline" size={16} color="#666" /> {phone}
            </Text>
          ))}
          
          {cardData.email ? (
            <Text style={styles.cardDetail}><Ionicons name="mail-outline" size={16} color="#666" /> {cardData.email}</Text>
          ) : null}
          
          {additionalEmails.map((email, index) => (
            <Text key={`email-${index}`} style={styles.cardDetail}>
              <Ionicons name="mail-outline" size={16} color="#666" /> {email}
            </Text>
          ))}
          
          {cardData.website ? (
            <Text style={styles.cardDetail}><Ionicons name="globe-outline" size={16} color="#666" /> {cardData.website}</Text>
          ) : null}
          
          {additionalWebsites.map((website, index) => (
            <Text key={`website-${index}`} style={styles.cardDetail}>
              <Ionicons name="globe-outline" size={16} color="#666" /> {website}
            </Text>
          ))}
          
          {notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notes}>{notes}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveToContacts}>
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Save to Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSaveToApp}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Save to App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSaveToBoth}>
          <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Save to Both</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 15,
  },
  cardPreview: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  notes: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  cancelButtonText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImportOptionsScreen; 