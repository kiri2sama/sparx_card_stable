import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  ScrollView, 
  Modal,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BusinessCard } from './HomeScreen';
import { saveBusinessCard } from '../utils/storageUtils';
import { saveToContacts } from '../utils/contactUtils';
import BusinessCardQR from '../components/BusinessCardQR';

type CardViewParams = {
  cardData: BusinessCard;
};

const CardViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cardData } = route.params as CardViewParams;
  const [showQRCode, setShowQRCode] = useState(false);
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

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsitePress = (website: string) => {
    // Add http:// if not already present
    let url = website;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    Linking.openURL(url);
  };

  const handleSaveCard = async () => {
    const success = await saveBusinessCard(cardData);
    if (success) {
      Alert.alert(
        'Success',
        'Business card saved successfully',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Already Saved',
        'This business card is already in your saved cards',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSaveToContacts = async () => {
    try {
      const success = await saveToContacts(cardData);
      if (success) {
        Alert.alert(
          'Success',
          'Business card saved to contacts',
          [{ text: 'OK' }]
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.name}>{cardData.name}</Text>
          
          {cardData.title ? (
            <Text style={styles.title}>{cardData.title}</Text>
          ) : null}
          
          {cardData.company ? (
            <Text style={styles.company}>{cardData.company}</Text>
          ) : null}
          
          <View style={styles.divider} />
          
          {cardData.phone ? (
            <TouchableOpacity style={styles.infoRow} onPress={() => handlePhonePress(cardData.phone)}>
              <Ionicons name="call-outline" size={22} color="#0066cc" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{cardData.phone}</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          
          {additionalPhones.map((phone, index) => (
            <TouchableOpacity 
              key={`phone-${index}`} 
              style={styles.infoRow} 
              onPress={() => handlePhonePress(phone)}
            >
              <Ionicons name="call-outline" size={22} color="#0066cc" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone {index + 2}</Text>
                <Text style={styles.infoValue}>{phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {cardData.email ? (
            <TouchableOpacity style={styles.infoRow} onPress={() => handleEmailPress(cardData.email)}>
              <Ionicons name="mail-outline" size={22} color="#0066cc" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{cardData.email}</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          
          {additionalEmails.map((email, index) => (
            <TouchableOpacity 
              key={`email-${index}`} 
              style={styles.infoRow} 
              onPress={() => handleEmailPress(email)}
            >
              <Ionicons name="mail-outline" size={22} color="#0066cc" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email {index + 2}</Text>
                <Text style={styles.infoValue}>{email}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {cardData.website ? (
            <TouchableOpacity style={styles.infoRow} onPress={() => handleWebsitePress(cardData.website)}>
              <Ionicons name="globe-outline" size={22} color="#0066cc" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Website</Text>
                <Text style={styles.infoValue}>{cardData.website}</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          
          {additionalWebsites.map((website, index) => (
            <TouchableOpacity 
              key={`website-${index}`} 
              style={styles.infoRow} 
              onPress={() => handleWebsitePress(website)}
            >
              <Ionicons name="globe-outline" size={22} color="#0066cc" style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Website {index + 2}</Text>
                <Text style={styles.infoValue}>{website}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notes}>{notes}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSaveCard}>
            <Ionicons name="bookmark-outline" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>Save Card</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowQRCode(true)}
          >
            <Ionicons name="qr-code-outline" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>Show QR</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleSaveToContacts}
        >
          <Ionicons name="person-add-outline" size={22} color="#0066cc" />
          <Text style={styles.secondaryButtonText}>Add to Contacts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <Modal
        visible={showQRCode}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRCode(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <BusinessCardQR 
              businessCard={cardData} 
              onClose={() => setShowQRCode(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  company: {
    fontSize: 18,
    color: '#0066cc',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  notes: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0066cc',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#0066cc',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    margin: 20,
  },
});

export default CardViewScreen; 