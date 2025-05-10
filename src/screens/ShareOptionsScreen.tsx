import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Share,
  Alert,
  ScrollView,
  Linking
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessCard } from '../types/businessCard';
import BusinessCardQR from '../components/BusinessCardQR';
import { businessCardToPayload } from '../utils/nfcUtils';

type ShareOptionsParams = {
  businessCard: BusinessCard;
};

const ShareOptionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const { businessCard } = route.params as ShareOptionsParams;
  const [showQRCode, setShowQRCode] = useState(false);
  
  const handleShareViaText = async () => {
    try {
      const formatCardForSharing = (card: BusinessCard): string => {
        let result = `${card.name}\n`;
        if (card.title) result += `${card.title}\n`;
        if (card.company) result += `${card.company}\n\n`;
        if (card.phone) result += `Phone: ${card.phone}\n`;
        if (card.email) result += `Email: ${card.email}\n`;
        if (card.website) result += `Website: ${card.website}\n`;
        
        // Add social profiles if available
        if (card.socialProfiles && Object.keys(card.socialProfiles).length > 0) {
          result += `\nSocial Profiles:\n`;
          Object.entries(card.socialProfiles).forEach(([platform, url]) => {
            result += `${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}\n`;
          });
        }
        
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
      Alert.alert('Error', 'Failed to share business card');
    }
  };
  
  const handleShareViaEmail = async () => {
    try {
      const formatCardForEmail = (card: BusinessCard): string => {
        let result = `Contact Information for ${card.name}\n\n`;
        if (card.title) result += `Title: ${card.title}\n`;
        if (card.company) result += `Company: ${card.company}\n\n`;
        if (card.phone) result += `Phone: ${card.phone}\n`;
        if (card.email) result += `Email: ${card.email}\n`;
        if (card.website) result += `Website: ${card.website}\n\n`;
        
        // Add social profiles if available
        if (card.socialProfiles && Object.keys(card.socialProfiles).length > 0) {
          result += `Social Profiles:\n`;
          Object.entries(card.socialProfiles).forEach(([platform, url]) => {
            result += `${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}\n`;
          });
          result += '\n';
        }
        
        if (card.notes) result += `Notes:\n${card.notes}\n\n`;
        
        result += `Shared via SparX Card App`;
        return result;
      };

      const body = formatCardForEmail(businessCard);
      const subject = `Contact Information: ${businessCard.name}`;
      
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Error', 'No email app found');
      }
    } catch (error) {
      console.error('Error sharing via email', error);
      Alert.alert('Error', 'Failed to share via email');
    }
  };
  
  const handleShareViaQR = () => {
    setShowQRCode(true);
  };
  
  const handleShareViaNFC = () => {
    navigation.navigate('NFCWriter' as never, { 
      businessCard,
      writeMode: true 
    } as never);
  };
  
  const handleShareViaLink = async () => {
    // In a real app, this would generate a shareable link to a web version of the card
    Alert.alert(
      'Feature Coming Soon',
      'Sharing via link will be available in a future update.'
    );
  };
  
  const shareOptions = [
    {
      id: 'text',
      title: 'Share via Text',
      icon: 'chatbubble-outline',
      color: theme.colors.primary,
      onPress: handleShareViaText,
    },
    {
      id: 'email',
      title: 'Share via Email',
      icon: 'mail-outline',
      color: theme.colors.primary,
      onPress: handleShareViaEmail,
    },
    {
      id: 'qr',
      title: 'Share via QR Code',
      icon: 'qr-code-outline',
      color: theme.colors.primary,
      onPress: handleShareViaQR,
    },
    {
      id: 'nfc',
      title: 'Share via NFC',
      icon: 'radio-outline',
      color: theme.colors.primary,
      onPress: handleShareViaNFC,
    },
    {
      id: 'link',
      title: 'Generate Shareable Link',
      icon: 'link-outline',
      color: theme.colors.primary,
      onPress: handleShareViaLink,
    },
  ];
  
  const socialShareOptions = [
    {
      id: 'linkedin',
      title: 'LinkedIn',
      icon: 'logo-linkedin',
      color: '#0077B5',
    },
    {
      id: 'twitter',
      title: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
    },
    {
      id: 'facebook',
      title: 'Facebook',
      icon: 'logo-facebook',
      color: '#1877F2',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
    },
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Share Options
        </Text>
        
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.cardPreview, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.previewTitle, { color: theme.colors.text }]}>
            {businessCard.name}
          </Text>
          
          {businessCard.title ? (
            <Text style={[styles.previewSubtitle, { color: theme.colors.textSecondary }]}>
              {businessCard.title}
              {businessCard.company ? ` at ${businessCard.company}` : ''}
            </Text>
          ) : businessCard.company ? (
            <Text style={[styles.previewSubtitle, { color: theme.colors.textSecondary }]}>
              {businessCard.company}
            </Text>
          ) : null}
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Share Options
          </Text>
          
          {shareOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.shareOption}
              onPress={option.onPress}
              accessibilityLabel={option.title}
              accessibilityRole="button"
            >
              <View style={[styles.shareIconContainer, { backgroundColor: `${option.color}20` }]}>
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>
              
              <Text style={[styles.shareOptionTitle, { color: theme.colors.text }]}>
                {option.title}
              </Text>
              
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Social Media
          </Text>
          
          <View style={styles.socialGrid}>
            {socialShareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.socialOption}
                onPress={() => {
                  Alert.alert(
                    'Feature Coming Soon',
                    `Sharing to ${option.title} will be available in a future update.`
                  );
                }}
                accessibilityLabel={`Share to ${option.title}`}
                accessibilityRole="button"
              >
                <View style={[styles.socialIconContainer, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon as any} size={24} color="#fff" />
                </View>
                
                <Text style={[styles.socialOptionTitle, { color: theme.colors.text }]}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* QR Code Modal */}
      {showQRCode && (
        <View style={styles.qrModal}>
          <View style={styles.qrModalContent}>
            <BusinessCardQR 
              businessCard={businessCard} 
              onClose={() => setShowQRCode(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cardPreview: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  shareIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shareOptionTitle: {
    fontSize: 16,
    flex: 1,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  socialOption: {
    width: '25%',
    alignItems: 'center',
    padding: 8,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialOptionTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  qrModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  qrModalContent: {
    margin: 20,
  },
});

export default ShareOptionsScreen;