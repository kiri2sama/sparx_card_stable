import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BusinessCard } from './HomeScreen';
import { initNfc, readNfcTag, cleanupNfc } from '../utils/nfcUtils';

const NFCReaderScreen = () => {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);

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

  const startScan = async () => {
    if (!nfcSupported) return;
    
    setIsScanning(true);
    
    try {
      const cardData = await readNfcTag();
      
      if (cardData) {
        // Navigate to card view with the data
        navigation.navigate('CardView' as never, { cardData } as never);
      } else {
        Alert.alert(
          'Read Failed',
          'Could not read business card data from the tag.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error scanning NFC tag', error);
      Alert.alert(
        'Scan Error',
        'There was an error reading the NFC tag.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsScanning(false);
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
      
      {isScanning ? (
        <>
          <ActivityIndicator size="large" color="#0066cc" style={styles.indicator} />
          <Text style={styles.scanText}>
            Hold your phone near the NFC business card
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={() => {
            cleanupNfc();
            setIsScanning(false);
          }}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.instructions}>
            Tap the button below to start scanning for an NFC business card
          </Text>
          <TouchableOpacity style={styles.button} onPress={startScan}>
            <Text style={styles.buttonText}>Start Scanning</Text>
          </TouchableOpacity>
        </>
      )}
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
});

export default NFCReaderScreen;