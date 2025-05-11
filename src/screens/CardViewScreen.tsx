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
import { BusinessCard } from '../types/businessCard';
import { saveBusinessCard } from '../utils/storageUtils';
import { saveToContacts } from '../utils/contactUtils';
import BusinessCardQR from '../components/BusinessCardQR';
import { useTheme } from '../styles/ThemeProvider';

type CardViewParams = {
  cardData: BusinessCard;
};

const CardViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{cardData.name}</Text>
          
          {cardData.title ? (
            <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{cardData.title}</Text>
          ) : null}
          
          {cardData.company ? (
            <Text style={[styles.company, { color: theme.colors.primary }]}>{cardData.company}</Text>
          ) : null}
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          {cardData.phone ? (
            <TouchableOpacity 
              style={styles.infoRow} 
              onPress={() => handlePhonePress(cardData.phone)}
              accessibilityLabel={`Call ${cardData.name} at ${cardData.phone}`}
              accessibilityRole="button"
            >
              <Ionicons name="call-outline" size={22} color={theme.colors.primary} style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{cardData.phone}</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          
          {additionalPhones.map((phone, index) => (
            <TouchableOpacity 
              key={`phone-${index}`} 
              style={styles.infoRow} 
              onPress={() => handlePhonePress(phone)}
              accessibilityLabel={`Call ${cardData.name} at alternate number ${phone}`}
              accessibilityRole="button"
            >
              <Ionicons name="call-outline" size={22} color={theme.colors.primary} style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Phone {index + 2}</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {cardData.email ? (
            <TouchableOpacity 
              style={styles.infoRow} 
              onPress={() => handleEmailPress(cardData.email)}
              accessibilityLabel={`Email ${cardData.name} at ${cardData.email}`}
              accessibilityRole="button"
            >
              <Ionicons name="mail-outline" size={22} color={theme.colors.primary} style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{cardData.email}</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          
          {additionalEmails.map((email, index) => (
            <TouchableOpacity 
              key={`email-${index}`} 
              style={styles.infoRow} 
              onPress={() => handleEmailPress(email)}
              accessibilityLabel={`Email ${cardData.name} at alternate address ${email}`}
              accessibilityRole="button"
            >
              <Ionicons name="mail-outline" size={22} color={theme.colors.primary} style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email {index + 2}</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{email}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {cardData.website ? (
            <TouchableOpacity 
              style={styles.infoRow} 
              onPress={() => handleWebsitePress(cardData.website)}
              accessibilityLabel={`Visit ${cardData.name}'s website at ${cardData.website}`}
              accessibilityRole="button"
            >
              <Ionicons name="globe-outline" size={22} color={theme.colors.primary} style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Website</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{cardData.website}</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          
          {additionalWebsites.map((website, index) => (
            <TouchableOpacity 
              key={`website-${index}`} 
              style={styles.infoRow} 
              onPress={() => handleWebsitePress(website)}
              accessibilityLabel={`Visit ${cardData.name}'s alternate website at ${website}`}
              accessibilityRole="button"
            >
              <Ionicons name="globe-outline" size={22} color={theme.colors.primary} style={styles.icon} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Website {index + 2}</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{website}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Social Media Profiles */}
          {cardData.socialProfiles && Object.keys(cardData.socialProfiles).length > 0 && (
            <View style={styles.socialSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Social Profiles</Text>
              {Object.entries(cardData.socialProfiles).map(([platform, url]) => (
                <TouchableOpacity
                  key={platform}
                  style={styles.infoRow}
                  onPress={() => handleWebsitePress(url)}
                  accessibilityLabel={`Visit ${cardData.name}'s ${platform} profile`}
                  accessibilityRole="button"
                >
                  <Ionicons 
                    name={`logo-${platform.toLowerCase()}`} 
                    size={22} 
                    color={theme.colors.primary} 
                    style={styles.icon} 
                  />
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.text }]}>{url}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {notes ? (
            <View style={styles.notesContainer}>
              <Text style={[styles.notesLabel, { color: theme.colors.text }]}>Notes</Text>
              <Text style={[styles.notes, { color: theme.colors.textSecondary }]}>{notes}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleSaveCard}
            accessibilityLabel="Save this business card"
            accessibilityRole="button"
          >
            <Ionicons name="bookmark-outline" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>Save Card</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowQRCode(true)}
            accessibilityLabel="Show QR code for this business card"
            accessibilityRole="button"
          >
            <Ionicons name="qr-code-outline" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>Show QR</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={handleSaveToContacts}
          accessibilityLabel="Add this business card to your contacts"
          accessibilityRole="button"
        >
          <Ionicons name="person-add-outline" size={22} color={theme.colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Add to Contacts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.backgroundDark }]}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={[styles.backButtonText, { color: theme.colors.text }]}>Back</Text>
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
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
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
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  company: {
    fontSize: 18,
    marginBottom: 16,
  },
  divider: {
    height: 1,
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
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
  },
  socialSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notes: {
    fontSize: 16,
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
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
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonText: {
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