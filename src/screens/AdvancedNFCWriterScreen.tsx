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
  Modal,
  Switch,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { initNfc, writeNfcTag, cleanupNfc, CardFormat, NfcTagInfo } from '../utils/nfcUtils';

// Define the types of NFC operations we can perform
enum NFCOperationType {
  WRITE_TEXT = 'Write Text',
  WRITE_URL = 'Write URL',
  WRITE_PHONE = 'Write Phone Number',
  WRITE_EMAIL = 'Write Email',
  WRITE_CONTACT = 'Write Contact',
  WRITE_WIFI = 'Write WiFi Credentials',
  WRITE_LOCATION = 'Write Location',
  WRITE_SOCIAL = 'Write Social Media',
  ERASE_TAG = 'Erase Tag',
  LOCK_TAG = 'Lock Tag',
  READ_TAG_INFO = 'Read Tag Info'
}

// Define the navigation param list
type RootStackParamList = {
  Home: undefined;
  AdvancedNFCWriter: undefined;
};

type AdvancedNFCWriterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdvancedNFCWriter'>;

const AdvancedNFCWriterScreen: React.FC = () => {
  const navigation = useNavigation() as AdvancedNFCWriterScreenNavigationProp;
  const { theme } = useTheme();
  
  // NFC state
  const [isProcessing, setIsProcessing] = useState(false);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [tagInfo, setTagInfo] = useState<NfcTagInfo | null>(null);
  
  // Operation state
  const [selectedOperation, setSelectedOperation] = useState<NFCOperationType | null>(null);
  const [operationData, setOperationData] = useState<any>({});
  
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

  // Handle operation selection
  const handleSelectOperation = (operation: NFCOperationType) => {
    setSelectedOperation(operation);
    
    // Reset operation data when changing operations
    setOperationData({});
    
    // Initialize default values based on operation type
    switch (operation) {
      case NFCOperationType.WRITE_WIFI:
        setOperationData({
          ssid: '',
          password: '',
          encryptionType: 'WPA',
          hidden: false
        });
        break;
      case NFCOperationType.WRITE_SOCIAL:
        setOperationData({
          platform: 'twitter',
          username: ''
        });
        break;
      default:
        setOperationData({});
        break;
    }
  };

  // Execute the selected NFC operation
  const executeOperation = async () => {
    if (!nfcSupported || !selectedOperation) return;
    
    setIsProcessing(true);
    setShowNfcModal(true);
    
    try {
      switch (selectedOperation) {
        case NFCOperationType.WRITE_TEXT:
          await handleWriteText();
          break;
        case NFCOperationType.WRITE_URL:
          await handleWriteUrl();
          break;
        case NFCOperationType.WRITE_PHONE:
          await handleWritePhone();
          break;
        case NFCOperationType.WRITE_EMAIL:
          await handleWriteEmail();
          break;
        case NFCOperationType.WRITE_CONTACT:
          await handleWriteContact();
          break;
        case NFCOperationType.WRITE_WIFI:
          await handleWriteWifi();
          break;
        case NFCOperationType.WRITE_LOCATION:
          await handleWriteLocation();
          break;
        case NFCOperationType.WRITE_SOCIAL:
          await handleWriteSocial();
          break;
        case NFCOperationType.ERASE_TAG:
          await handleEraseTag();
          break;
        case NFCOperationType.LOCK_TAG:
          await handleLockTag();
          break;
        case NFCOperationType.READ_TAG_INFO:
          await handleReadTagInfo();
          break;
        default:
          throw new Error('Unknown operation');
      }
    } catch (error) {
      console.error(`Error executing ${selectedOperation}:`, error);
      Alert.alert(
        'Operation Failed',
        `Failed to perform ${selectedOperation}: ${error.message || 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
      setShowNfcModal(false);
    }
  };

  // Operation handlers
  const handleWriteText = async () => {
    const { text } = operationData;
    if (!text) {
      throw new Error('Text is required');
    }
    
    // Create a simple text record
    const result = await writeNfcTag({
      name: 'Text Record',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      notes: text,
    }, CardFormat.JSON);
    
    if (result.success) {
      Alert.alert('Success', 'Text written to tag successfully');
    } else {
      throw new Error(result.error || 'Failed to write text to tag');
    }
  };

  const handleWriteUrl = async () => {
    const { url } = operationData;
    if (!url) {
      throw new Error('URL is required');
    }
    
    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://');
    }
    
    // Create a URL record
    const result = await writeNfcTag({
      name: 'URL Record',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: url,
      notes: '',
    }, CardFormat.JSON);
    
    if (result.success) {
      Alert.alert('Success', 'URL written to tag successfully');
    } else {
      throw new Error(result.error || 'Failed to write URL to tag');
    }
  };

  const handleWritePhone = async () => {
    const { phone } = operationData;
    if (!phone) {
      throw new Error('Phone number is required');
    }
    
    // Create a phone record
    const result = await writeNfcTag({
      name: 'Phone Record',
      title: '',
      company: '',
      phone: phone,
      email: '',
      website: '',
      notes: '',
    }, CardFormat.JSON);
    
    if (result.success) {
      Alert.alert('Success', 'Phone number written to tag successfully');
    } else {
      throw new Error(result.error || 'Failed to write phone number to tag');
    }
  };

  const handleWriteEmail = async () => {
    const { email, subject, body } = operationData;
    if (!email) {
      throw new Error('Email address is required');
    }
    
    // Create an email record
    const result = await writeNfcTag({
      name: 'Email Record',
      title: subject || '',
      company: '',
      phone: '',
      email: email,
      website: '',
      notes: body || '',
    }, CardFormat.JSON);
    
    if (result.success) {
      Alert.alert('Success', 'Email address written to tag successfully');
    } else {
      throw new Error(result.error || 'Failed to write email to tag');
    }
  };

  const handleWriteContact = async () => {
    const { name, phone, email, company, title } = operationData;
    if (!name) {
      throw new Error('Name is required');
    }
    
    // Create a contact record
    const result = await writeNfcTag({
      name: name,
      title: title || '',
      company: company || '',
      phone: phone || '',
      email: email || '',
      website: '',
      notes: '',
    }, CardFormat.VCARD);
    
    if (result.success) {
      Alert.alert('Success', 'Contact information written to tag successfully');
    } else {
      throw new Error(result.error || 'Failed to write contact to tag');
    }
  };

  const handleWriteWifi = async () => {
    const { ssid, password, encryptionType, hidden } = operationData;
    if (!ssid) {
      throw new Error('SSID is required');
    }
    
    // Create a WiFi record
    // For WiFi, we'll store the data in the notes field in a specific format
    const wifiData = `WIFI:S:${ssid};T:${encryptionType || 'WPA'};P:${password || ''};H:${hidden ? 'true' : 'false'};;`;
    
    const result = await writeNfcTag({
      name: 'WiFi Record',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      notes: wifiData,
    }, CardFormat.JSON);
    
    if (result.success) {
      Alert.alert('Success', 'WiFi credentials written to tag successfully');
    } else {
      throw new Error(result.error || 'Failed to write WiFi credentials to tag');
    }
  };

  const handleWriteLocation = async () => {
    const { latitude, longitude, name } = operationData;
    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }
    
    // Create a location record
    // For location, we'll store the data in the notes field in a specific format
    const locationData = `geo:${latitude},${longitude}`;
    
    const result = await writeNfcTag({
      name: name || 'Location Record',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      notes: locationData,
    }, CardFormat.JSON);
    
    if (result.success) {
      Alert.alert('Success', 'Location written to tag successfully');
    } else {
      throw new Error(result.error || 'Failed to write location to tag');
    }
  };

  const handleWriteSocial = async () => {
    const { platform, username } = operationData;
    if (!platform || !username) {
      throw new Error('Platform and username are required');
    }
    
    // Create a social media record
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/${username}`;
        break;
      case 'instagram':
        url = `https://instagram.com/${username}`;
        break;
      case 'facebook':
        url = `https://facebook.com/${username}`;
        break;
      case 'linkedin':
        url = `https://linkedin.com/in/${username}`;
        break;
      case 'github':
        url = `https://github.com/${username}`;
        break;
      default:
        url = username; // Use as-is if not a known platform
    }
    
    const result = await writeNfcTag({
      name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Profile`,
      title: '',
      company: '',
      phone: '',
      email: '',
      website: url,
      notes: '',
      socialProfiles: {
        [platform]: username
      }
    }, CardFormat.JSON);
    
    if (result.success) {
      Alert.alert('Success', `${platform} profile written to tag successfully`);
    } else {
      throw new Error(result.error || 'Failed to write social media profile to tag');
    }
  };

  const handleEraseTag = async () => {
    // To erase a tag, we write an empty NDEF message
    const result = await writeNfcTag({
      name: '',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
      notes: '',
    }, CardFormat.JSON);
    
    if (result.success) {
      Alert.alert('Success', 'Tag erased successfully');
    } else {
      throw new Error(result.error || 'Failed to erase tag');
    }
  };

  const handleLockTag = async () => {
    // This would require a native module implementation for locking tags
    Alert.alert(
      'Not Implemented',
      'Tag locking requires additional native implementation. This feature is coming soon.',
      [{ text: 'OK' }]
    );
  };

  const handleReadTagInfo = async () => {
    // This would read and display tag information
    Alert.alert(
      'Not Implemented',
      'Tag info reading is available in the NFC Reader screen.',
      [{ text: 'OK' }]
    );
  };

  // Render the input form based on the selected operation
  const renderOperationForm = () => {
    if (!selectedOperation) return null;
    
    switch (selectedOperation) {
      case NFCOperationType.WRITE_TEXT:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Text Content</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Enter text to write to the tag"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.text || ''}
              onChangeText={(text) => setOperationData({ ...operationData, text })}
              multiline
              numberOfLines={4}
            />
          </View>
        );
        
      case NFCOperationType.WRITE_URL:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>URL</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="https://example.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.url || ''}
              onChangeText={(url) => setOperationData({ ...operationData, url })}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        );
        
      case NFCOperationType.WRITE_PHONE:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="+1234567890"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.phone || ''}
              onChangeText={(phone) => setOperationData({ ...operationData, phone })}
              keyboardType="phone-pad"
            />
          </View>
        );
        
      case NFCOperationType.WRITE_EMAIL:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="example@email.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.email || ''}
              onChangeText={(email) => setOperationData({ ...operationData, email })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Subject (Optional)</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Email subject"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.subject || ''}
              onChangeText={(subject) => setOperationData({ ...operationData, subject })}
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Body (Optional)</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, height: 100 }]}
              placeholder="Email body"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.body || ''}
              onChangeText={(body) => setOperationData({ ...operationData, body })}
              multiline
              numberOfLines={4}
            />
          </View>
        );
        
      case NFCOperationType.WRITE_CONTACT:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Name*</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.name || ''}
              onChangeText={(name) => setOperationData({ ...operationData, name })}
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Phone</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="+1234567890"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.phone || ''}
              onChangeText={(phone) => setOperationData({ ...operationData, phone })}
              keyboardType="phone-pad"
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="example@email.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.email || ''}
              onChangeText={(email) => setOperationData({ ...operationData, email })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Company</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Company Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.company || ''}
              onChangeText={(company) => setOperationData({ ...operationData, company })}
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Title</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Job Title"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.title || ''}
              onChangeText={(title) => setOperationData({ ...operationData, title })}
            />
          </View>
        );
        
      case NFCOperationType.WRITE_WIFI:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>SSID (Network Name)*</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="WiFi Network Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.ssid || ''}
              onChangeText={(ssid) => setOperationData({ ...operationData, ssid })}
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Password</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="WiFi Password"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.password || ''}
              onChangeText={(password) => setOperationData({ ...operationData, password })}
              secureTextEntry
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Encryption Type</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  operationData.encryptionType === 'WPA' && styles.pickerOptionSelected,
                  { borderColor: theme.colors.border }
                ]}
                onPress={() => setOperationData({ ...operationData, encryptionType: 'WPA' })}
              >
                <Text style={[
                  styles.pickerOptionText,
                  { color: operationData.encryptionType === 'WPA' ? theme.colors.primary : theme.colors.text }
                ]}>WPA/WPA2</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  operationData.encryptionType === 'WEP' && styles.pickerOptionSelected,
                  { borderColor: theme.colors.border }
                ]}
                onPress={() => setOperationData({ ...operationData, encryptionType: 'WEP' })}
              >
                <Text style={[
                  styles.pickerOptionText,
                  { color: operationData.encryptionType === 'WEP' ? theme.colors.primary : theme.colors.text }
                ]}>WEP</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  operationData.encryptionType === 'NONE' && styles.pickerOptionSelected,
                  { borderColor: theme.colors.border }
                ]}
                onPress={() => setOperationData({ ...operationData, encryptionType: 'NONE' })}
              >
                <Text style={[
                  styles.pickerOptionText,
                  { color: operationData.encryptionType === 'NONE' ? theme.colors.primary : theme.colors.text }
                ]}>None</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Hidden Network</Text>
              <Switch
                value={operationData.hidden || false}
                onValueChange={(hidden) => setOperationData({ ...operationData, hidden })}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={operationData.hidden ? theme.colors.card : '#f4f3f4'}
              />
            </View>
          </View>
        );
        
      case NFCOperationType.WRITE_LOCATION:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Location Name (Optional)</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Home, Office, etc."
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.name || ''}
              onChangeText={(name) => setOperationData({ ...operationData, name })}
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Latitude*</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="37.7749"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.latitude || ''}
              onChangeText={(latitude) => setOperationData({ ...operationData, latitude })}
              keyboardType="numeric"
            />
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Longitude*</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="-122.4194"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.longitude || ''}
              onChangeText={(longitude) => setOperationData({ ...operationData, longitude })}
              keyboardType="numeric"
            />
            
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
              onPress={() => {
                // This would use the device's location
                Alert.alert('Get Current Location', 'This feature will be implemented soon.');
              }}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                Use Current Location
              </Text>
            </TouchableOpacity>
          </View>
        );
        
      case NFCOperationType.WRITE_SOCIAL:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Platform*</Text>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    operationData.platform === 'twitter' && styles.pickerOptionSelected,
                    { borderColor: theme.colors.border }
                  ]}
                  onPress={() => setOperationData({ ...operationData, platform: 'twitter' })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: operationData.platform === 'twitter' ? theme.colors.primary : theme.colors.text }
                  ]}>Twitter</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    operationData.platform === 'instagram' && styles.pickerOptionSelected,
                    { borderColor: theme.colors.border }
                  ]}
                  onPress={() => setOperationData({ ...operationData, platform: 'instagram' })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: operationData.platform === 'instagram' ? theme.colors.primary : theme.colors.text }
                  ]}>Instagram</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    operationData.platform === 'facebook' && styles.pickerOptionSelected,
                    { borderColor: theme.colors.border }
                  ]}
                  onPress={() => setOperationData({ ...operationData, platform: 'facebook' })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: operationData.platform === 'facebook' ? theme.colors.primary : theme.colors.text }
                  ]}>Facebook</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    operationData.platform === 'linkedin' && styles.pickerOptionSelected,
                    { borderColor: theme.colors.border }
                  ]}
                  onPress={() => setOperationData({ ...operationData, platform: 'linkedin' })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: operationData.platform === 'linkedin' ? theme.colors.primary : theme.colors.text }
                  ]}>LinkedIn</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    operationData.platform === 'github' && styles.pickerOptionSelected,
                    { borderColor: theme.colors.border }
                  ]}
                  onPress={() => setOperationData({ ...operationData, platform: 'github' })}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: operationData.platform === 'github' ? theme.colors.primary : theme.colors.text }
                  ]}>GitHub</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            
            <Text style={[styles.label, { color: theme.colors.text, marginTop: 10 }]}>Username/Profile ID*</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="username"
              placeholderTextColor={theme.colors.textSecondary}
              value={operationData.username || ''}
              onChangeText={(username) => setOperationData({ ...operationData, username })}
              autoCapitalize="none"
            />
          </View>
        );
        
      case NFCOperationType.ERASE_TAG:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.warningText, { color: '#cc0000' }]}>
              This will erase all data on the NFC tag. This action cannot be undone.
            </Text>
            <TouchableOpacity
              style={[styles.dangerButton, { backgroundColor: '#cc0000' }]}
              onPress={() => {
                Alert.alert(
                  'Confirm Erase',
                  'Are you sure you want to erase this tag? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Erase', style: 'destructive', onPress: executeOperation }
                  ]
                );
              }}
            >
              <Text style={styles.dangerButtonText}>Erase Tag</Text>
            </TouchableOpacity>
          </View>
        );
        
      case NFCOperationType.LOCK_TAG:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.warningText, { color: '#cc0000' }]}>
              Warning: Locking a tag is permanent. Once locked, the tag cannot be modified again.
            </Text>
            <TouchableOpacity
              style={[styles.dangerButton, { backgroundColor: '#cc0000' }]}
              onPress={() => {
                Alert.alert(
                  'Confirm Lock',
                  'Are you sure you want to permanently lock this tag? This action CANNOT be undone and the tag will be read-only forever.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Lock', style: 'destructive', onPress: executeOperation }
                  ]
                );
              }}
            >
              <Text style={styles.dangerButtonText}>Lock Tag Permanently</Text>
            </TouchableOpacity>
          </View>
        );
        
      case NFCOperationType.READ_TAG_INFO:
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Tap the button below to read detailed information about an NFC tag.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={executeOperation}
            >
              <Text style={styles.buttonText}>Read Tag Info</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  // Render the operation selection screen
  const renderOperationSelection = () => {
    const operations = Object.values(NFCOperationType);
    
    return (
      <View style={styles.operationSelectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Select NFC Operation
        </Text>
        
        <FlatList
          data={operations}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.operationItem,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
              ]}
              onPress={() => handleSelectOperation(item)}
            >
              <View style={styles.operationIconContainer}>
                {getOperationIcon(item)}
              </View>
              <View style={styles.operationTextContainer}>
                <Text style={[styles.operationTitle, { color: theme.colors.text }]}>
                  {item}
                </Text>
                <Text style={[styles.operationDescription, { color: theme.colors.textSecondary }]}>
                  {getOperationDescription(item)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />}
        />
      </View>
    );
  };

  // Helper function to get icon for each operation
  const getOperationIcon = (operation: NFCOperationType) => {
    let iconName = 'help-circle-outline';
    let color = theme.colors.primary;
    
    switch (operation) {
      case NFCOperationType.WRITE_TEXT:
        iconName = 'text-outline';
        break;
      case NFCOperationType.WRITE_URL:
        iconName = 'globe-outline';
        break;
      case NFCOperationType.WRITE_PHONE:
        iconName = 'call-outline';
        break;
      case NFCOperationType.WRITE_EMAIL:
        iconName = 'mail-outline';
        break;
      case NFCOperationType.WRITE_CONTACT:
        iconName = 'person-outline';
        break;
      case NFCOperationType.WRITE_WIFI:
        iconName = 'wifi-outline';
        break;
      case NFCOperationType.WRITE_LOCATION:
        iconName = 'location-outline';
        break;
      case NFCOperationType.WRITE_SOCIAL:
        iconName = 'share-social-outline';
        break;
      case NFCOperationType.ERASE_TAG:
        iconName = 'trash-outline';
        color = '#cc0000';
        break;
      case NFCOperationType.LOCK_TAG:
        iconName = 'lock-closed-outline';
        color = '#cc0000';
        break;
      case NFCOperationType.READ_TAG_INFO:
        iconName = 'information-circle-outline';
        break;
    }
    
    return <Ionicons name={iconName as any} size={24} color={color} />;
  };

  // Helper function to get description for each operation
  const getOperationDescription = (operation: NFCOperationType): string => {
    switch (operation) {
      case NFCOperationType.WRITE_TEXT:
        return 'Write plain text to an NFC tag';
      case NFCOperationType.WRITE_URL:
        return 'Write a website URL to an NFC tag';
      case NFCOperationType.WRITE_PHONE:
        return 'Write a phone number to an NFC tag';
      case NFCOperationType.WRITE_EMAIL:
        return 'Write an email address to an NFC tag';
      case NFCOperationType.WRITE_CONTACT:
        return 'Write contact information to an NFC tag';
      case NFCOperationType.WRITE_WIFI:
        return 'Write WiFi credentials to an NFC tag';
      case NFCOperationType.WRITE_LOCATION:
        return 'Write geographic coordinates to an NFC tag';
      case NFCOperationType.WRITE_SOCIAL:
        return 'Write social media profile to an NFC tag';
      case NFCOperationType.ERASE_TAG:
        return 'Erase all data from an NFC tag';
      case NFCOperationType.LOCK_TAG:
        return 'Permanently lock an NFC tag (irreversible)';
      case NFCOperationType.READ_TAG_INFO:
        return 'Read detailed information about an NFC tag';
      default:
        return '';
    }
  };

  // Loading state
  if (nfcSupported === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Checking NFC availability...
        </Text>
      </View>
    );
  }

  // NFC not supported
  if (nfcSupported === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#cc0000" />
        <Text style={[styles.errorText, { color: '#cc0000' }]}>
          NFC is not supported on this device.
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {selectedOperation ? (
          <>
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedOperation(null)}
              >
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                {selectedOperation}
              </Text>
            </View>
            
            {renderOperationForm()}
            
            {selectedOperation !== NFCOperationType.ERASE_TAG && 
             selectedOperation !== NFCOperationType.LOCK_TAG && (
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={executeOperation}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    Write to NFC Tag
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </>
        ) : (
          renderOperationSelection()
        )}
      </ScrollView>
      
      {/* Modal for NFC scanning */}
      <Modal
        visible={showNfcModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowNfcModal(false);
          cleanupNfc();
          setIsProcessing(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Ready to Write
            </Text>
            <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
              Hold your phone near the NFC tag to write the data.
            </Text>
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.modalIndicator} />
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                setShowNfcModal(false);
                cleanupNfc();
                setIsProcessing(false);
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
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  formContainer: {
    marginBottom: 20,
  },
  operationSelectionContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  operationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  operationIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  operationTextContainer: {
    flex: 1,
  },
  operationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  operationDescription: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pickerOption: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  pickerOptionSelected: {
    borderWidth: 2,
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    marginVertical: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalIndicator: {
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdvancedNFCWriterScreen;