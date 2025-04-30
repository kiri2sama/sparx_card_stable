import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Share, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BusinessCard } from './HomeScreen';
import QRCode from 'react-native-qrcode-svg';
import { businessCardToPayload } from '../utils/nfcUtils';
import { Ionicons } from '@expo/vector-icons';
import { saveToPhoneContacts, openContact } from '../utils/contactUtils';
import { saveBusinessCard } from '../utils/storageUtils';

type RootStackParamList = {
  Home: undefined;
  NFCReader: undefined;
  NFCWriter: {
    editMode?: boolean;
    businessCard?: BusinessCard;
  };
  ContactPreview: { 
    businessCard: BusinessCard 
  };
  Saved: undefined;
};

type ContactPreviewScreenProps = {
  route: {
    params: {
      businessCard: BusinessCard;
    }
  }
};

const ContactPreviewScreen: React.FC<ContactPreviewScreenProps> = ({ route }) => {
  const { businessCard } = route.params;
  const navigation = useNavigation();
  const [isSaving, setIsSaving] = useState(false);

  // Function to save to app's contacts using AsyncStorage
  const handleSaveToApp = async () => {
    setIsSaving(true);
    try {
      console.log('Attempting to save business card:', businessCard);
      const success = await saveBusinessCard(businessCard);
      console.log('Save result:', success);
      
      if (success) {
        Alert.alert(
          'Saved to App',
          'Contact has been saved to your app\'s business cards.',
          [
            { 
              text: 'OK',
              style: 'cancel'
            },
            {
              text: 'View Saved Cards',
              onPress: () => navigation.navigate('SavedCards' as never)
            }
          ]
        );
      } else {
        Alert.alert(
          'Already Saved',
          'This contact is already saved in your app.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving contact to app:', error);
      Alert.alert(
        'Error',
        'Failed to save contact to app.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Function to save to phone contacts
  const handleSaveToPhone = async () => {
    setIsSaving(true);
    try {
      const result = await saveToPhoneContacts(businessCard);
      
      if (result.success) {
        console.log('Contact shared for saving to phone');
        
        // We no longer need to attempt to open the contact, as the system UI will handle this
        // The user will be prompted by the system to save the contact

        // Show a brief success message just for feedback after a short delay
        setTimeout(() => {
          setIsSaving(false);
        }, 500);
      } else {
        setIsSaving(false);
        Alert.alert(
          'Could Not Open Contact UI', 
          'The system contact UI could not be opened. Please check app permissions.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error with contact sharing:', error);
      setIsSaving(false);
      Alert.alert(
        'Error', 
        'Failed to share contact for saving. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Function to share the contact
  const handleShare = async () => {
    try {
      const payload = businessCardToPayload(businessCard);
      await Share.share({
        message: `Contact Information: ${businessCard.name}\n${businessCard.phone}\n${businessCard.email}\n${businessCard.website}`,
        title: `${businessCard.name}'s Contact Information`,
      });
    } catch (error) {
      console.error('Error sharing contact:', error);
      Alert.alert('Error', 'Failed to share contact information.');
    }
  };

  // Function to edit the contact before saving
  const handleEdit = () => {
    // Navigate to the NFCWriter screen with the business card data
    navigation.navigate('NFCWriter' as never, { editMode: true, businessCard } as never);
  };

  if (isSaving) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Saving contact...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contact Preview</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.name}>{businessCard.name}</Text>
        
        {businessCard.title && (
          <Text style={styles.detail}>{businessCard.title}</Text>
        )}
        
        {businessCard.company && (
          <Text style={styles.detail}>{businessCard.company}</Text>
        )}
        
        <View style={styles.divider} />
        
        {businessCard.phone && (
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={20} color="#555" />
            <Text style={styles.contactText}>{businessCard.phone}</Text>
          </View>
        )}
        
        {businessCard.additionalPhones && businessCard.additionalPhones.map((phone, index) => (
          <View key={`phone-${index}`} style={styles.contactRow}>
            <Ionicons name="call-outline" size={20} color="#555" />
            <Text style={styles.contactText}>{phone}</Text>
          </View>
        ))}
        
        {businessCard.email && (
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={20} color="#555" />
            <Text style={styles.contactText}>{businessCard.email}</Text>
          </View>
        )}
        
        {businessCard.additionalEmails && businessCard.additionalEmails.map((email, index) => (
          <View key={`email-${index}`} style={styles.contactRow}>
            <Ionicons name="mail-outline" size={20} color="#555" />
            <Text style={styles.contactText}>{email}</Text>
          </View>
        ))}
        
        {businessCard.website && (
          <View style={styles.contactRow}>
            <Ionicons name="globe-outline" size={20} color="#555" />
            <Text style={styles.contactText}>{businessCard.website}</Text>
          </View>
        )}
        
        {businessCard.additionalWebsites && businessCard.additionalWebsites.map((website, index) => (
          <View key={`website-${index}`} style={styles.contactRow}>
            <Ionicons name="globe-outline" size={20} color="#555" />
            <Text style={styles.contactText}>{website}</Text>
          </View>
        ))}
        
        {businessCard.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes:</Text>
            <Text style={styles.notesText}>{businessCard.notes}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.qrContainer}>
        <Text style={styles.sectionTitle}>QR Code</Text>
        <QRCode
          value={businessCardToPayload(businessCard)}
          size={200}
          backgroundColor="white"
          color="black"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveToApp}>
          <Ionicons name="save-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Save to App</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleSaveToPhone}>
          <Ionicons name="person-add-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Save to Contacts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <Ionicons name="create-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  notesSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  notesText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ContactPreviewScreen; 