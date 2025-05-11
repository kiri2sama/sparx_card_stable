import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BusinessCard } from '../screens/HomeScreen';
import { businessCardToPayload } from '../utils/nfcUtils';
import { Ionicons } from '@expo/vector-icons';

interface BusinessCardQRProps {
  businessCard: BusinessCard;
  size?: number;
  onClose?: () => void;
}

const BusinessCardQR: React.FC<BusinessCardQRProps> = ({ 
  businessCard, 
  size = 200,
  onClose
}) => {
  const qrValue = businessCardToPayload(businessCard);
  
  const handleShare = async () => {
    try {
      const formatCardForSharing = (card: BusinessCard): string => {
        let result = `${card.name}\n`;
        if (card.title) result += `${card.title}\n`;
        if (card.company) result += `${card.company}\n\n`;
        if (card.phone) result += `Phone: ${card.phone}\n`;
        if (card.email) result += `Email: ${card.email}\n`;
        if (card.website) result += `Website: ${card.website}\n`;
        if (card.notes) result += `\nNotes: ${card.notes}\n`;
        return result;
      };

      const message = formatCardForSharing(businessCard);
      
      await Share.share({
        message: message,
        title: `${businessCard.name}'s Business Card`,
      });
    } catch (error) {
      console.error('Error sharing business card', error);
    }
  };

  return (
    <View style={styles.container}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      )}
      
      <Text style={styles.title}>Business Card QR Code</Text>
      <Text style={styles.subtitle}>Scan to share your information</Text>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={size}
          color="#000"
          backgroundColor="#fff"
        />
      </View>
      
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="share-outline" size={20} color="#fff" style={styles.shareIcon} />
        <Text style={styles.shareText}>Share Card Info</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        Others can scan this QR code to get your business card information
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    maxWidth: 320,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 16,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  info: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default BusinessCardQR; 