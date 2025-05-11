import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/ThemeProvider';
import BusinessCardQR from './BusinessCardQR';
import { CardProfile } from './CardPreview';
import Button from './Button';
import Card from './Card';

type ShareOption = {
  id: string;
  title: string;
  icon: string;
  description: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
};

type ShareModalProps = {
  visible: boolean;
  onClose: () => void;
  cardData: CardProfile;
  onNfcShare?: () => void;
  onQrShare?: () => void;
  onWalletShare?: () => void;
  onEmailShare?: () => void;
  onMessageShare?: () => void;
  onLinkShare?: () => void;
  onSocialShare?: (platform: string) => void;
};

const { width, height } = Dimensions.get('window');

const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  cardData,
  onNfcShare,
  onQrShare,
  onWalletShare,
  onEmailShare,
  onMessageShare,
  onLinkShare,
  onSocialShare,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'share' | 'qr' | 'nfc'>('share');
  const [nfcAnimating, setNfcAnimating] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const nfcRingAnim = useRef(new Animated.Value(0)).current;
  const nfcOpacityAnim = useRef(new Animated.Value(1)).current;
  
  // Animate modal in and out
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Reset to share tab when closing
      setActiveTab('share');
      
      // Stop NFC animation if active
      if (nfcAnimating) {
        stopNfcAnimation();
      }
    }
  }, [visible]);
  
  // NFC animation
  const startNfcAnimation = () => {
    setNfcAnimating(true);
    
    // Reset animation values
    nfcRingAnim.setValue(0);
    nfcOpacityAnim.setValue(1);
    
    // Create the pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(nfcRingAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(nfcOpacityAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(nfcRingAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(nfcOpacityAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
    
    // Call the NFC share function if provided
    if (onNfcShare) {
      onNfcShare();
    }
  };
  
  // Stop NFC animation
  const stopNfcAnimation = () => {
    setNfcAnimating(false);
    nfcRingAnim.stopAnimation();
    nfcOpacityAnim.stopAnimation();
  };
  
  // Handle tab change
  const handleTabChange = (tab: 'share' | 'qr' | 'nfc') => {
    setActiveTab(tab);
    
    // Start or stop NFC animation based on tab
    if (tab === 'nfc') {
      startNfcAnimation();
    } else if (nfcAnimating) {
      stopNfcAnimation();
    }
  };
  
  // Interpolate NFC ring scale
  const nfcRingScale = nfcRingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });
  
  // Define share options
  const shareOptions: ShareOption[] = [
    {
      id: 'nfc',
      title: 'NFC Tap',
      icon: 'wifi-outline',
      description: 'Share by tapping phones together',
      onPress: () => handleTabChange('nfc'),
      disabled: !onNfcShare,
      color: theme.colors.primary,
    },
    {
      id: 'qr',
      title: 'QR Code',
      icon: 'qr-code-outline',
      description: 'Share via scannable QR code',
      onPress: () => handleTabChange('qr'),
      color: theme.colors.secondary,
    },
    {
      id: 'wallet',
      title: 'Add to Wallet',
      icon: 'wallet-outline',
      description: 'Save to Apple/Google Wallet',
      onPress: onWalletShare || (() => {}),
      disabled: !onWalletShare,
      color: theme.colors.info,
    },
    {
      id: 'email',
      title: 'Email',
      icon: 'mail-outline',
      description: 'Send via email',
      onPress: onEmailShare || (() => {}),
      color: theme.colors.warning,
    },
    {
      id: 'message',
      title: 'chatbubble-outline',
      icon: 'chatbubble-outline',
      description: 'Share via SMS or messaging app',
      onPress: onMessageShare || (() => {}),
      color: theme.colors.success,
    },
    {
      id: 'link',
      title: 'Copy Link',
      icon: 'link-outline',
      description: 'Copy shareable link to clipboard',
      onPress: onLinkShare || (() => {}),
      disabled: !onLinkShare,
      color: theme.colors.primary,
    },
  ];
  
  // Define social share options
  const socialOptions = [
    {
      id: 'linkedin',
      title: 'LinkedIn',
      icon: 'logo-linkedin',
      color: '#0077B5',
      onPress: () => onSocialShare && onSocialShare('linkedin'),
    },
    {
      id: 'twitter',
      title: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      onPress: () => onSocialShare && onSocialShare('twitter'),
    },
    {
      id: 'facebook',
      title: 'Facebook',
      icon: 'logo-facebook',
      color: '#1877F2',
      onPress: () => onSocialShare && onSocialShare('facebook'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      onPress: () => onSocialShare && onSocialShare('whatsapp'),
    },
  ];
  
  // Render share options tab
  const renderShareOptions = () => {
    // Filter available options
    const availableOptions = shareOptions.filter(option => !option.disabled);
    
    return (
      <ScrollView 
        style={styles.tabContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Share options grid */}
        <View style={styles.shareGrid}>
          {availableOptions.map((option) => (
            <Card
              key={option.id}
              variant="elevated"
              elevation="md"
              borderRadius="lg"
              style={styles.shareOption}
              onPress={option.onPress}
            >
              <View style={styles.shareOptionContent}>
                <View 
                  style={[
                    styles.shareIconContainer,
                    { backgroundColor: `${option.color}20` }
                  ]}
                >
                  <Ionicons name={option.icon as any} size={24} color={option.color} />
                </View>
                <Text 
                  style={[
                    styles.shareOptionTitle,
                    { 
                      color: theme.colors.text,
                      fontFamily: theme.typography.fontFamily.sans,
                    }
                  ]}
                >
                  {option.title}
                </Text>
                <Text 
                  style={[
                    styles.shareOptionDescription,
                    { 
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.fontFamily.sans,
                    }
                  ]}
                  numberOfLines={2}
                >
                  {option.description}
                </Text>
              </View>
            </Card>
          ))}
        </View>
        
        {/* Social sharing section */}
        {onSocialShare && (
          <View style={styles.socialSection}>
            <Text 
              style={[
                styles.sectionTitle,
                { 
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.sans,
                }
              ]}
            >
              Share on Social Media
            </Text>
            
            <View style={styles.socialGrid}>
              {socialOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.socialButton,
                    { backgroundColor: option.color }
                  ]}
                  onPress={option.onPress}
                  activeOpacity={0.8}
                  accessibilityLabel={`Share on ${option.title}`}
                  accessibilityRole="button"
                >
                  <Ionicons name={option.icon as any} size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>
                    {option.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };
  
  // Render QR code tab
  const renderQrCode = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.qrContainer}>
          <Card
            variant="elevated"
            elevation="md"
            borderRadius="lg"
            style={styles.qrCard}
          >
            <BusinessCardQR 
              businessCard={{
                name: cardData.name,
                email: cardData.email,
                phone: cardData.phone,
                company: cardData.company,
                title: cardData.title,
                website: cardData.website || '',
                notes: '',
              }}
              size={width * 0.6}
            />
          </Card>
          
          <Text 
            style={[
              styles.qrInstructions,
              { 
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.sans,
              }
            ]}
          >
            Scan this QR code to view {cardData.name}'s digital business card
          </Text>
          
          <View style={styles.qrActions}>
            <Button
              variant="primary"
              label="Save to Photos"
              leftIcon="save-outline"
              style={{ marginRight: 8, flex: 1 }}
            />
            
            <Button
              variant="outline"
              label="Share QR"
              leftIcon="share-outline"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    );
  };
  
  // Render NFC tab
  const renderNfc = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.nfcContainer}>
          <View style={styles.nfcAnimation}>
            {/* Animated rings */}
            <Animated.View 
              style={[
                styles.nfcRing,
                {
                  borderColor: theme.colors.primary,
                  opacity: nfcOpacityAnim,
                  transform: [{ scale: nfcRingScale }],
                }
              ]}
            />
            
            {/* Phone icon */}
            <Card
              variant="elevated"
              elevation="md"
              style={styles.nfcPhone}
            >
              <Ionicons name="phone-portrait-outline" size={40} color={theme.colors.primary} />
            </Card>
          </View>
          
          <Text 
            style={[
              styles.nfcTitle,
              { 
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.sans,
              }
            ]}
          >
            Ready to Share
          </Text>
          
          <Text 
            style={[
              styles.nfcInstructions,
              { 
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.sans,
              }
            ]}
          >
            Hold your phone near another device to share your business card via NFC
          </Text>
          
          <Button
            variant="outline"
            label="Cancel"
            onPress={() => handleTabChange('share')}
            style={{ marginTop: 24 }}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.overlay,
            { 
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.overlayTouch}
            onPress={onClose}
            activeOpacity={1}
            accessibilityLabel="Close share options"
            accessibilityRole="button"
            accessibilityHint="Closes the share modal"
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.modalContent,
            { 
              backgroundColor: theme.colors.background,
              transform: [{ translateY: slideAnim }],
              borderTopLeftRadius: theme.borderRadius.xl,
              borderTopRightRadius: theme.borderRadius.xl,
            }
          ]}
          accessibilityViewIsModal={true}
          accessibilityLiveRegion="polite"
        >
          {/* Handle */}
          <View 
            style={[
              styles.handle,
              { backgroundColor: theme.colors.border }
            ]}
          />
          
          {/* Header */}
          <View style={styles.header}>
            <Text 
              style={[
                styles.title,
                { 
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.sans,
                }
              ]}
              accessibilityRole="header"
            >
              Share Business Card
            </Text>
            
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Card preview */}
          <View style={styles.cardPreviewContainer}>
            <Card
              variant="elevated"
              elevation="md"
              borderRadius="lg"
              padding="none"
              style={styles.cardPreview}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    {cardData.photoUri ? (
                      <Image 
                        source={{ uri: cardData.photoUri }} 
                        style={styles.cardAvatar}
                      />
                    ) : (
                      <View style={[
                        styles.cardAvatarPlaceholder,
                        { backgroundColor: 'rgba(255,255,255,0.2)' }
                      ]}>
                        <Ionicons name="person" size={24} color="#fff" />
                      </View>
                    )}
                    
                    <View style={styles.cardInfo}>
                      <Text 
                        style={[
                          styles.cardName,
                          { fontFamily: theme.typography.fontFamily.sans }
                        ]}
                      >
                        {cardData.name}
                      </Text>
                      <Text 
                        style={[
                          styles.cardTitle,
                          { fontFamily: theme.typography.fontFamily.sans }
                        ]}
                      >
                        {cardData.title}
                      </Text>
                      <Text 
                        style={[
                          styles.cardCompany,
                          { fontFamily: theme.typography.fontFamily.sans }
                        ]}
                      >
                        {cardData.company}
                      </Text>
                    </View>
                    
                    {cardData.logoUri && (
                      <Image 
                        source={{ uri: cardData.logoUri }} 
                        style={styles.cardLogo}
                      />
                    )}
                  </View>
                  
                  <View style={styles.cardContact}>
                    <View style={styles.contactItem}>
                      <Ionicons name="mail-outline" size={16} color="#fff" style={styles.contactIcon} />
                      <Text 
                        style={[
                          styles.contactText,
                          { fontFamily: theme.typography.fontFamily.sans }
                        ]}
                        numberOfLines={1}
                      >
                        {cardData.email}
                      </Text>
                    </View>
                    <View style={styles.contactItem}>
                      <Ionicons name="call-outline" size={16} color="#fff" style={styles.contactIcon} />
                      <Text 
                        style={[
                          styles.contactText,
                          { fontFamily: theme.typography.fontFamily.sans }
                        ]}
                        numberOfLines={1}
                      >
                        {cardData.phone}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Card>
          </View>
          
          {/* Tabs */}
          <View 
            style={[
              styles.tabs,
              { borderBottomColor: theme.colors.border }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'share' && { 
                  borderBottomColor: theme.colors.primary,
                  borderBottomWidth: 2,
                }
              ]}
              onPress={() => handleTabChange('share')}
              accessibilityRole="tab"
              accessibilityLabel="Share options"
              accessibilityState={{ selected: activeTab === 'share' }}
            >
              <Text 
                style={[
                  styles.tabText,
                  { 
                    color: activeTab === 'share' 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary,
                    fontFamily: theme.typography.fontFamily.sans,
                  }
                ]}
              >
                Share
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'qr' && { 
                  borderBottomColor: theme.colors.primary,
                  borderBottomWidth: 2,
                }
              ]}
              onPress={() => handleTabChange('qr')}
              accessibilityRole="tab"
              accessibilityLabel="QR code"
              accessibilityState={{ selected: activeTab === 'qr' }}
            >
              <Text 
                style={[
                  styles.tabText,
                  { 
                    color: activeTab === 'qr' 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary,
                    fontFamily: theme.typography.fontFamily.sans,
                  }
                ]}
              >
                QR Code
              </Text>
            </TouchableOpacity>
            
            {onNfcShare && (
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'nfc' && { 
                    borderBottomColor: theme.colors.primary,
                    borderBottomWidth: 2,
                  }
                ]}
                onPress={() => handleTabChange('nfc')}
                accessibilityRole="tab"
                accessibilityLabel="NFC tap"
                accessibilityState={{ selected: activeTab === 'nfc' }}
              >
                <Text 
                  style={[
                    styles.tabText,
                    { 
                      color: activeTab === 'nfc' 
                        ? theme.colors.primary 
                        : theme.colors.textSecondary,
                      fontFamily: theme.typography.fontFamily.sans,
                    }
                  ]}
                >
                  NFC Tap
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Tab content */}
          {activeTab === 'share' && renderShareOptions()}
          {activeTab === 'qr' && renderQrCode()}
          {activeTab === 'nfc' && renderNfc()}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTouch: {
    flex: 1,
  },
  modalContent: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, // Extra padding for iOS home indicator
    maxHeight: height * 0.9,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardPreviewContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    width: '100%',
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    aspectRatio: 1.7 / 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  cardCompany: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
  },
  cardLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardContact: {
    marginTop: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
    flex: 1,
  },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shareOption: {
    width: '48%',
    marginBottom: 16,
  },
  shareOptionContent: {
    padding: 16,
    alignItems: 'center',
  },
  shareIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  shareOptionDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  socialSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrCard: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInstructions: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  qrActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  nfcContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  nfcAnimation: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  nfcRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
  },
  nfcPhone: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nfcInstructions: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default ShareModal;