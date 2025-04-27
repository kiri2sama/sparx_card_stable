import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  HomeMain: undefined;
  NFCReader: undefined;
  NFCWriter: undefined;
  QRReader: undefined;
  CardView: { cardData?: BusinessCard };
};

export type BusinessCard = {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  notes: string;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeMain'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digital Business Card</Text>
      <Text style={styles.subtitle}>Create, share and collect business cards</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('NFCReader')}
        >
          <Ionicons name="wifi-outline" size={28} color="white" style={styles.buttonIcon} />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>Read NFC Card</Text>
            <Text style={styles.buttonSubtext}>Scan an NFC business card</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('QRReader')}
        >
          <Ionicons name="qr-code-outline" size={28} color="white" style={styles.buttonIcon} />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>Scan QR Code</Text>
            <Text style={styles.buttonSubtext}>Read a business card QR code</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('NFCWriter')}
        >
          <Ionicons name="create-outline" size={28} color="white" style={styles.buttonIcon} />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>Create NFC Card</Text>
            <Text style={styles.buttonSubtext}>Write your info to an NFC tag</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 15,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default HomeScreen;