import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BusinessCard } from '../types/businessCard';
import { businessCardToPayload } from '../utils/nfcUtils';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';

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
  const { theme } = useTheme();
  const qrValue = businessCardToPayload(businessCard);
  
  const handleShare = async () => {
    try {
      const formatCardForSharing = (card: BusinessCard): string => {
        let result = `${card.name}\\n`;
        if (card.title) result += `${card.title}\\n`;
        if (card.company) result += `${card.company}\\n\\n`;
        if (card.phone) result += `Phone: ${card.phone}\\n`;
        if (card.email) result += `Email: ${card.email}\\n`;
        if (card.website) result += `Website: ${card.website}\\n`;
        
        // Add social profiles if available
        if (card.socialProfiles && Object.keys(card.socialProfiles).length > 0) {
          result += `\\nSocial Profiles:\\n`;
          Object.entries(card.socialProfiles).forEach(([platform, url]) => {
            result += `${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}\\n`;
          });
        }
        
        if (card.notes) result += `\\nNotes: ${card.notes}\\n`;
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
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {onClose && (
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      )}
      
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Business Card QR Code
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Scan to share your information
      </Text>
      
      <View style={[styles.qrContainer, { borderColor: theme.colors.border }]}>
        <QRCode
          value={qrValue}
          size={size}
          color={theme.colors.text}
          backgroundColor={theme.colors.card}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleShare}
        accessibilityLabel="Share card information"
        accessibilityRole="button"
      >
        <Ionicons name="share-outline" size={20} color="#fff" style={styles.shareIcon} />
        <Text style={styles.shareText}>Share Card Info</Text>
      </TouchableOpacity>
      
      <Text style={[styles.info, { color: theme.colors.textLight }]}>
        Others can scan this QR code to get your business card information
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  qrContainer: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  shareButton: {
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
    textAlign: 'center',
  },
});

export default BusinessCardQR;