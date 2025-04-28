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
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BusinessCard } from './HomeScreen';
import { initNfc, writeNfcTag, cleanupNfc } from '../utils/nfcUtils';

type RootStackParamList = {
  Home: undefined;
  NFCWriter: undefined;
};

type NFCWriterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NFCWriter'>;

const NFCWriterScreen = () => {
  const navigation = useNavigation() as NFCWriterScreenNavigationProp;
  const [isWriting, setIsWriting] = useState(false);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const [cardData, setCardData] = useState<BusinessCard>({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    notes: ''
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

  const handleInputChange = (field: keyof BusinessCard, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddField = (field: 'phone' | 'email' | 'website') => {
    const currentValue = cardData[field];
    const additionalField = cardData.notes || '';
    const newValue = additionalField ? 
      `${additionalField}\nAdditional ${field}s: ${currentValue}` :
      `Additional ${field}s: ${currentValue}`;
    
    setCardData(prev => ({
      ...prev,
      [field]: '',
      notes: newValue
    }));
  };

  const isFormValid = () => {
    // At minimum, we need a name
    return cardData.name.trim().length > 0;
  };

  const startWrite = async () => {
    if (!nfcSupported || !isFormValid()) return;
    
    setIsWriting(true);
    
    try {
      Alert.alert(
        'Ready to Write',
        'Hold your phone near the NFC tag to write your business card information.',
        [{ text: 'Cancel', onPress: () => {
          cleanupNfc();
          setIsWriting(false);
        }}],
        { cancelable: false }
      );
      
      const success = await writeNfcTag(cardData);
      
      if (success) {
        Alert.alert(
          'Success',
          'Business card data successfully written to the NFC tag.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Write Failed',
          'Could not write business card data to the tag.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error writing to NFC tag', error);
      Alert.alert(
        'Write Error',
        'There was an error writing to the NFC tag.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsWriting(false);
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
            value={cardData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            editable={!isWriting}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Software Engineer"
            value={cardData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            editable={!isWriting}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company</Text>
          <TextInput
            style={styles.input}
            placeholder="Acme Inc."
            value={cardData.company}
            onChangeText={(text) => handleInputChange('company', text)}
            editable={!isWriting}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputWithButtonInput]}
              placeholder="+1 (555) 123-4567"
              value={cardData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
              editable={!isWriting}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddField('phone')}
              disabled={!cardData.phone || isWriting}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputWithButtonInput]}
              placeholder="john.doe@example.com"
              value={cardData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isWriting}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddField('email')}
              disabled={!cardData.email || isWriting}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Website</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputWithButtonInput]}
              placeholder="www.example.com"
              value={cardData.website}
              onChangeText={(text) => handleInputChange('website', text)}
              autoCapitalize="none"
              editable={!isWriting}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddField('website')}
              disabled={!cardData.website || isWriting}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional information..."
            value={cardData.notes}
            onChangeText={(text) => handleInputChange('notes', text)}
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
        
        {isWriting && (
          <ActivityIndicator size="large" color="#0066cc" style={styles.indicator} />
        )}
      </ScrollView>
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
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithButtonInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#0066cc',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default NFCWriterScreen; 