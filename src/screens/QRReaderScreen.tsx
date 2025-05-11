import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { BusinessCard } from './HomeScreen';

type ScanResult = {
  type: string;
  data: string;
};

const QRReaderScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: ScanResult) => {
    if (scanned || isProcessing) return;
    
    setScanned(true);
    setIsProcessing(true);
    
    try {
      // Clean and validate the data
      const cleanData = data.trim();
      if (!cleanData) {
        throw new Error('Empty QR code data');
      }

      // Parse the QR code data
      const parsed = JSON.parse(cleanData);
      
      // Validate and sanitize the data
      const cardData: BusinessCard = {
        name: String(parsed.name || '').trim(),
        title: String(parsed.title || '').trim(),
        company: String(parsed.company || '').trim(),
        phone: String(parsed.phone || '').trim(),
        email: String(parsed.email || '').trim(),
        website: String(parsed.website || '').trim(),
        notes: String(parsed.notes || '').trim()
      };
      
      // Check if the parsed data has the required fields
      if (!cardData.name) {
        Alert.alert(
          'Invalid QR Code',
          'This QR code does not contain valid business card data.',
          [{ text: 'OK', onPress: () => {
            setScanned(false);
            setIsProcessing(false);
          }}]
        );
        return;
      }
      
      // Navigate to the card view with the parsed data
      navigation.navigate('CardView' as never, { cardData } as never);
    } catch (error) {
      console.error('Error parsing QR code data:', error);
      Alert.alert(
        'Invalid Format',
        'The scanned QR code is not in the correct format.',
        [{ text: 'OK', onPress: () => {
          setScanned(false);
          setIsProcessing(false);
        }}]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[
          BarCodeScanner.Constants.BarCodeType.qr,
          BarCodeScanner.Constants.BarCodeType.ean13,
          BarCodeScanner.Constants.BarCodeType.code128
        ]}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanArea}></View>
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <Text style={styles.instructionText}>
          Position the QR code within the square
        </Text>
        
        {scanned && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              setScanned(false);
              setIsProcessing(false);
            }}
          >
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
        
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
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});

export default QRReaderScreen; 