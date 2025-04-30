import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BusinessCard } from './HomeScreen';
import { initNfc, writeNfcTag, cleanupNfc, saveRecordAsJson, loadRecordFromJson } from '../utils/nfcUtils';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  NFCWriter: undefined;
};

type NFCWriterScreenProps = {
  route: {
    params?: {
      editMode?: boolean;
      businessCard?: BusinessCard;
    }
  }
};

type NFCWriterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NFCWriter'>;

const NFCWriterScreen: React.FC<NFCWriterScreenProps> = ({ route }) => {
  const navigation = useNavigation() as NFCWriterScreenNavigationProp;
  const [isWriting, setIsWriting] = useState(false);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const [showWritingMessage, setShowWritingMessage] = useState(false);
  
  // Get business card from params if in edit mode
  const editMode = route.params?.editMode || false;
  const existingCard = route.params?.businessCard;
  
  // Primary form fields
  const [name, setName] = useState(existingCard?.name || '');
  const [title, setTitle] = useState(existingCard?.title || '');
  const [company, setCompany] = useState(existingCard?.company || '');
  const [notes, setNotes] = useState(existingCard?.notes || '');
  
  // Multiple field collections
  const [phones, setPhones] = useState<string[]>(() => {
    if (existingCard) {
      const phoneList = [existingCard.phone];
      if (existingCard.additionalPhones && existingCard.additionalPhones.length > 0) {
        return [...phoneList, ...existingCard.additionalPhones];
      }
      return phoneList;
    }
    return [''];
  });
  
  const [emails, setEmails] = useState<string[]>(() => {
    if (existingCard) {
      const emailList = [existingCard.email];
      if (existingCard.additionalEmails && existingCard.additionalEmails.length > 0) {
        return [...emailList, ...existingCard.additionalEmails];
      }
      return emailList;
    }
    return [''];
  });
  
  const [websites, setWebsites] = useState<string[]>(() => {
    if (existingCard) {
      const websiteList = [existingCard.website];
      if (existingCard.additionalWebsites && existingCard.additionalWebsites.length > 0) {
        return [...websiteList, ...existingCard.additionalWebsites];
      }
      return websiteList;
    }
    return [''];
  });

  // Check if NFC is supported on this device
  useEffect(() => {
    const checkNfcSupport = async () => {
      const supported = await initNfc();
      setNfcSupported(supported);
      
      if (!supported) {
        Alert.alert(
          'NFC Not Supported',
          'This device does not support NFC or NFC is not enabled.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    };
    
    checkNfcSupport();
    
    return () => {
      cleanupNfc();
    };
  }, [navigation]);

  // Add a new empty field to the specified array
  const handleAddField = (type: 'phone' | 'email' | 'website') => {
    if (type === 'phone') {
      setPhones([...phones, '']);
    } else if (type === 'email') {
      setEmails([...emails, '']);
    } else if (type === 'website') {
      setWebsites([...websites, '']);
    }
  };

  // Update value in a specific array at given index
  const handleMultiInputChange = (
    type: 'phone' | 'email' | 'website', 
    index: number, 
    value: string
  ) => {
    if (type === 'phone') {
      const updatedPhones = [...phones];
      updatedPhones[index] = value;
      setPhones(updatedPhones);
    } else if (type === 'email') {
      const updatedEmails = [...emails];
      updatedEmails[index] = value;
      setEmails(updatedEmails);
    } else if (type === 'website') {
      const updatedWebsites = [...websites];
      updatedWebsites[index] = value;
      setWebsites(updatedWebsites);
    }
  };

  // Remove a field at specified index
  const handleRemoveField = (
    type: 'phone' | 'email' | 'website',
    index: number
  ) => {
    if (type === 'phone' && phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    } else if (type === 'email' && emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    } else if (type === 'website' && websites.length > 1) {
      setWebsites(websites.filter((_, i) => i !== index));
    }
  };

  const isFormValid = () => {
    // At minimum, we need a name
    return name.trim().length > 0;
  };

  const startWrite = async () => {
    if (!nfcSupported || !isFormValid()) return;
    
    setIsWriting(true);
    setShowWritingMessage(true);
    
    try {
      // Prepare the business card data
      const cardData: BusinessCard = {
        name,
        title,
        company,
        // Use the first phone, email, website as primary 
        phone: phones[0] || '',
        email: emails[0] || '',
        website: websites[0] || '',
        notes: notes
      };

      // Store all phone numbers in the card object
      // The first one is already in the phone field
      if (phones.length > 1) {
        // Store all additional phone numbers in the additionalPhones property
        const additionalPhonesList = phones.slice(1).filter(p => p.trim() !== '');
        if (additionalPhonesList.length > 0) {
          cardData.additionalPhones = additionalPhonesList;
        }
      }

      // Store all email addresses in the card object 
      if (emails.length > 1) {
        // Store all additional emails in the additionalEmails property
        const additionalEmailsList = emails.slice(1).filter(e => e.trim() !== '');
        if (additionalEmailsList.length > 0) {
          cardData.additionalEmails = additionalEmailsList;
        }
      }

      // Store all websites in the card object
      if (websites.length > 1) {
        // Store all additional websites in the additionalWebsites property
        const additionalWebsitesList = websites.slice(1).filter(w => w.trim() !== '');
        if (additionalWebsitesList.length > 0) {
          cardData.additionalWebsites = additionalWebsitesList;
        }
      }
      
      const success = await writeNfcTag(cardData);
      
      // Hide the writing message modal
      setShowWritingMessage(false);
      
      if (success) {
        // Create a success message with details about what was written
        let successDetails = `Name: ${name}\n`;
        
        if (title) successDetails += `Title: ${title}\n`;
        if (company) successDetails += `Company: ${company}\n`;
        
        // Add phone numbers info
        successDetails += `Phone numbers: ${phones.filter(p => p.trim()).length}\n`;
        
        // Add email info
        successDetails += `Email addresses: ${emails.filter(e => e.trim()).length}\n`;
        
        // Add website info
        if (websites.some(w => w.trim())) {
          successDetails += `Websites: ${websites.filter(w => w.trim()).length}\n`;
        }
        
        Alert.alert(
          'Success!',
          `Business card data successfully written to the NFC tag.\n\nCard Details:\n${successDetails}`,
          [
            { 
              text: 'New Card', 
              onPress: () => {
                // Reset form for a new card
                setName('');
                setTitle('');
                setCompany('');
                setPhones(['']);
                setEmails(['']);
                setWebsites(['']);
                setNotes('');
              } 
            },
            { 
              text: 'Done', 
              onPress: () => navigation.goBack(),
              style: 'default'
            }
          ]
        );
      } else {
        Alert.alert(
          'Write Failed',
          'Could not write business card data to the tag. Make sure the tag is NFC NDEF compatible and try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error writing to NFC tag', error);
      
      // Determine error type and provide specific error messages
      let errorMessage = 'There was an error writing to the NFC tag.';
      
      if (error.message) {
        if (error.message.includes('Tag was lost')) {
          errorMessage = 'The NFC tag was removed too quickly. Please hold the tag against your device until the write operation completes.';
        } else if (error.message.includes('IOException')) {
          errorMessage = 'There was an issue writing to this tag. The tag might be read-only or corrupted.';
        } else if (error.message.includes('unsupported tag api')) {
          errorMessage = 'This NFC tag type is not supported. Please use an NDEF-compliant NFC tag.';
        } else if (error.message.includes('too small')) {
          errorMessage = 'The card data is too large for this tag. Try removing some information or use a larger capacity tag.';
        } 
      }
      
      Alert.alert(
        'Write Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsWriting(false);
      setShowWritingMessage(false);
    }
  };

  const handleSaveRecord = async () => {
    // Gather all card data as in startWrite
    const cardData: BusinessCard = {
      name,
      title,
      company,
      phone: phones[0] || '',
      email: emails[0] || '',
      website: websites[0] || '',
      notes,
      additionalPhones: phones.slice(1).filter(p => p.trim() !== ''),
      additionalEmails: emails.slice(1).filter(e => e.trim() !== ''),
      additionalWebsites: websites.slice(1).filter(w => w.trim() !== ''),
    };
    const fileUri = await saveRecordAsJson(cardData);
    if (fileUri) {
      Alert.alert('Saved', `Record saved to:\n${fileUri}`);
    } else {
      Alert.alert('Error', 'Failed to save record.');
    }
  };

  const handleLoadRecord = async () => {
    const loadedCard = await loadRecordFromJson();
    if (loadedCard) {
      setName(loadedCard.name || '');
      setTitle(loadedCard.title || '');
      setCompany(loadedCard.company || '');
      setNotes(loadedCard.notes || '');
      setPhones([loadedCard.phone || '', ...(loadedCard.additionalPhones || [])]);
      setEmails([loadedCard.email || '', ...(loadedCard.additionalEmails || [])]);
      setWebsites([loadedCard.website || '', ...(loadedCard.additionalWebsites || [])]);
      Alert.alert('Loaded', 'Record loaded successfully!');
    } else {
      Alert.alert('Error', 'No record loaded.');
    }
  };

  if (nfcSupported === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Checking NFC availability...</Text>
      </View>
    );
  }

  if (nfcSupported === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>NFC is not supported on this device.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Business Card</Text>
        <Text style={styles.subtitle}>Enter your information below</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            editable={!isWriting}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Software Engineer"
            value={title}
            onChangeText={setTitle}
            editable={!isWriting}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company</Text>
          <TextInput
            style={styles.input}
            placeholder="Acme Inc."
            value={company}
            onChangeText={setCompany}
            editable={!isWriting}
          />
        </View>
        
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Phone</Text>
            <TouchableOpacity 
              style={styles.addSmallButton}
              onPress={() => handleAddField('phone')}
              disabled={isWriting}
            >
              <Ionicons name="add-circle" size={24} color="#0066cc" />
            </TouchableOpacity>
          </View>
          
          {phones.map((phone, index) => (
            <View key={`phone-${index}`} style={styles.dynamicInputRow}>
              <TextInput
                style={[styles.input, styles.dynamicInput]}
                placeholder={index === 0 ? "Primary Phone" : `Phone ${index + 1}`}
                value={phone}
                onChangeText={(value) => handleMultiInputChange('phone', index, value)}
                keyboardType="phone-pad"
                editable={!isWriting}
              />
              {index > 0 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveField('phone', index)}
                  disabled={isWriting}
                >
                  <Ionicons name="close-circle" size={24} color="#cc0000" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Email</Text>
            <TouchableOpacity 
              style={styles.addSmallButton}
              onPress={() => handleAddField('email')}
              disabled={isWriting}
            >
              <Ionicons name="add-circle" size={24} color="#0066cc" />
            </TouchableOpacity>
          </View>
          
          {emails.map((email, index) => (
            <View key={`email-${index}`} style={styles.dynamicInputRow}>
              <TextInput
                style={[styles.input, styles.dynamicInput]}
                placeholder={index === 0 ? "Primary Email" : `Email ${index + 1}`}
                value={email}
                onChangeText={(value) => handleMultiInputChange('email', index, value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isWriting}
              />
              {index > 0 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveField('email', index)}
                  disabled={isWriting}
                >
                  <Ionicons name="close-circle" size={24} color="#cc0000" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Website</Text>
            <TouchableOpacity 
              style={styles.addSmallButton}
              onPress={() => handleAddField('website')}
              disabled={isWriting}
            >
              <Ionicons name="add-circle" size={24} color="#0066cc" />
            </TouchableOpacity>
          </View>
          
          {websites.map((website, index) => (
            <View key={`website-${index}`} style={styles.dynamicInputRow}>
              <TextInput
                style={[styles.input, styles.dynamicInput]}
                placeholder={index === 0 ? "Primary Website" : `Website ${index + 1}`}
                value={website}
                onChangeText={(value) => handleMultiInputChange('website', index, value)}
                autoCapitalize="none"
                editable={!isWriting}
              />
              {index > 0 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveField('website', index)}
                  disabled={isWriting}
                >
                  <Ionicons name="close-circle" size={24} color="#cc0000" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional information..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            editable={!isWriting}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            (!isFormValid() || isWriting) && styles.buttonDisabled
          ]} 
          onPress={startWrite}
          disabled={!isFormValid() || isWriting}
        >
          <Text style={styles.buttonText}>
            {isWriting ? 'Writing...' : 'Write to NFC Tag'}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginRight: 8 }]}
            onPress={handleSaveRecord}
            disabled={isWriting}
          >
            <Text style={styles.buttonText}>Save Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginLeft: 8 }]}
            onPress={handleLoadRecord}
            disabled={isWriting}
          >
            <Text style={styles.buttonText}>Load Record</Text>
          </TouchableOpacity>
        </View>
        
        {isWriting && (
          <ActivityIndicator size="large" color="#0066cc" style={styles.indicator} />
        )}
      </ScrollView>
      
      {/* Modal for writing message instead of Alert */}
      <Modal
        visible={showWritingMessage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowWritingMessage(false);
          cleanupNfc();
          setIsWriting(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ready to Write</Text>
            <Text style={styles.modalMessage}>Hold your phone near the NFC tag to write your business card information.</Text>
            <ActivityIndicator size="large" color="#0066cc" style={styles.modalIndicator} />
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowWritingMessage(false);
                cleanupNfc();
                setIsWriting(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 30,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dynamicInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dynamicInput: {
    flex: 1,
    marginRight: 8,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicator: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#cc0000',
    marginBottom: 30,
    textAlign: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  addSmallButton: {
    padding: 5,
  },
  removeButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#cc0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalIndicator: {
    marginVertical: 10,
  },
});

export default NFCWriterScreen;