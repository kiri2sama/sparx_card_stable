import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Share,
  Linking,
  Platform
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import QRCode from 'react-native-qrcode-svg';

type CardSharingProps = {
  cardId?: string;
  cardName?: string;
  cardUrl?: string;
};

const CardSharing: React.FC<CardSharingProps> = ({ 
  cardId = '123456', 
  cardName = 'My Business Card',
  cardUrl = 'https://sparxcard.com/card/123456'
}) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Check out my digital business card: ${cardName}`);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${message}\n\n${cardUrl}`,
        url: cardUrl, // iOS only
        title: cardName, // Android only
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log(`Shared with ${result.activityType}`);
        } else {
          // shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong when trying to share');
      console.error(error);
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(cardUrl);
    Alert.alert('Success', 'Link copied to clipboard');
  };

  const handleEmailShare = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    const subject = encodeURIComponent(cardName);
    const body = encodeURIComponent(`${message}\n\n${cardUrl}`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    
    Linking.canOpenURL(mailtoUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert('Error', 'Email app is not available');
        }
      })
      .catch(error => {
        Alert.alert('Error', 'Something went wrong when trying to open email app');
        console.error(error);
      });
  };

  const handleAddToWallet = () => {
    // This would typically involve generating a pass file and adding it to the wallet
    // For now, we'll just show an alert with instructions
    Alert.alert(
      'Add to Digital Wallet',
      Platform.OS === 'ios' 
        ? 'To add this card to Apple Wallet, you would need to generate a .pkpass file. This feature will be available soon.'
        : 'To add this card to Google Wallet, you would need to generate a .pkpass file. This feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.qrContainer}>
        <QRCode
          value={cardUrl}
          size={200}
          color={theme.colors.text}
          backgroundColor={theme.colors.cardBackground}
        />
        <Text style={[styles.qrText, { color: theme.colors.textSecondary }]}>
          Scan to view digital card
        </Text>
      </View>
      
      <View style={styles.shareOptionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Share Options</Text>
        
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleShare}
        >
          <Ionicons name="share-social-outline" size={20} color="white" />
          <Text style={styles.shareButtonText}>Share Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: theme.colors.accent }]}
          onPress={handleCopyLink}
        >
          <Ionicons name="copy-outline" size={20} color="white" />
          <Text style={styles.shareButtonText}>Copy Link</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: theme.colors.secondary }]}
          onPress={handleAddToWallet}
        >
          <Ionicons name="wallet-outline" size={20} color="white" />
          <Text style={styles.shareButtonText}>
            Add to {Platform.OS === 'ios' ? 'Apple' : 'Google'} Wallet
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.emailShareContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Share via Email</Text>
        
        <TextInput
          style={[
            styles.input, 
            { 
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.cardBackground
            }
          ]}
          placeholder="Recipient Email"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={[
            styles.input, 
            styles.messageInput,
            { 
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.cardBackground
            }
          ]}
          placeholder="Message (optional)"
          placeholderTextColor={theme.colors.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity 
          style={[styles.emailButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleEmailShare}
        >
          <Ionicons name="mail-outline" size={20} color="white" />
          <Text style={styles.shareButtonText}>Send Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
  },
  qrText: {
    marginTop: 12,
    fontSize: 14,
  },
  shareOptionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emailShareContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
});

export default CardSharing;