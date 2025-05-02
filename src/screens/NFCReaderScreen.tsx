import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, PermissionsAndroid, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BusinessCard } from './HomeScreen';
import { initNfc, readNfcTag, cleanupNfc } from '../utils/nfcUtils';

// Update the type definition to include all stack screens
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
};

type NFCReaderScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NFCReader'>;

const NFCReaderScreen = () => {
  const navigation = useNavigation() as NFCReaderScreenNavigationProp;
  const [isReading, setIsReading] = useState(false);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const [cardData, setCardData] = useState<BusinessCard | null>(null);
  const [showScanningMessage, setShowScanningMessage] = useState(false);

  // Request required permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE
        ];

        const results = await PermissionsAndroid.requestMultiple(permissions);
        
        const allGranted = Object.values(results).every(
          result => result === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert(
            'Permissions Required',
            'This app needs contacts and phone permissions to save business cards.',
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        console.warn('Error requesting permissions:', err);
      }
    }
  };

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
      } else {
        // Request permissions when NFC is supported
        await requestPermissions();
      }
    };
    
    checkNfcSupport();
    
    return () => {
      cleanupNfc();
    };
  }, [navigation]);

  const handleNfcRead = async () => {
    setIsReading(true);
    setShowScanningMessage(true);
    
    try {
      const businessCard = await readNfcTag();
      
      // Hide the scanning message modal
      setShowScanningMessage(false);
      
      if (businessCard) {
        navigation.navigate('ContactPreview', { businessCard });
      } else {
        Alert.alert(
          'No Data',
          'No business card data found on the NFC tag. Please make sure the tag contains a valid card and try again.',
          [
            { text: 'Try Again', onPress: () => setIsReading(false) },
            { text: 'Done', onPress: () => navigation.goBack(), style: 'default' }
          ]
        );
      }
    } catch (error) {
      console.error('Error reading NFC tag:', error);
      Alert.alert(
        'Read Error',
        'Failed to read the NFC tag. Please try again.',
        [
          { text: 'Try Again', onPress: () => setIsReading(false) },
          { text: 'Done', onPress: () => navigation.goBack(), style: 'default' }
        ]
      );
    } finally {
      setIsReading(false);
      setShowScanningMessage(false);
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
    <View style={styles.container}>
      <Text style={styles.title}>NFC Card Reader</Text>
      
      {isReading ? (
        <>
          <ActivityIndicator size="large" color="#0066cc" style={styles.indicator} />
          <Text style={styles.scanText}>
            Hold your phone near the NFC business card
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={() => {
            cleanupNfc();
            setIsReading(false);
            setShowScanningMessage(false);
          }}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.instructions}>
            Tap the button below to start scanning for an NFC business card
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleNfcRead}>
            <Text style={styles.buttonText}>Start Scanning</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Modal for scanning message instead of Alert */}
      <Modal
        visible={showScanningMessage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowScanningMessage(false);
          cleanupNfc();
          setIsReading(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ready to Scan</Text>
            <Text style={styles.modalMessage}>Hold your phone near the NFC tag to read the business card.</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowScanningMessage(false);
                cleanupNfc();
                setIsReading(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicator: {
    marginBottom: 20,
  },
  scanText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#cc0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
  },
  cancelButtonText: {
    color: '#cc0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#cc0000',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
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
    backgroundColor: '#0066cc',
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

export default NFCReaderScreen;


