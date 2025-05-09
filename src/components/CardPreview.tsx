import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import Avatar from './Avatar';
import Badge from './Badge';

export type CardProfile = {
  id?: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  photoUri?: string;
  logoUri?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
    dribbble?: string;
  };
};

export type CardTheme = {
  id: string;
  name: string;
  colors: string[];
  textColor: string;
  layout: 'horizontal' | 'vertical';
  accentColor?: string;
  fontFamily?: string;
};

type CardPreviewProps = {
  profile: CardProfile;
  cardTheme?: CardTheme;
  scale?: number;
  onPress?: () => void;
  isEditable?: boolean;
  onEdit?: () => void;
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  showShadow?: boolean;
  borderRadius?: number;
  showBadge?: boolean;
  badgeText?: string;
};

const defaultTheme: CardTheme = {
  id: 'default',
  name: 'Default',
  colors: ['#0066cc', '#38ef7d'],
  textColor: '#ffffff',
  layout: 'horizontal',
  accentColor: '#ffffff',
};

const CardPreview: React.FC<CardPreviewProps> = ({
  profile,
  cardTheme = defaultTheme,
  scale = 1,
  onPress,
  isEditable = false,
  onEdit,
  elevation = 'lg',
  showShadow = true,
  borderRadius = 16,
  showBadge = false,
  badgeText,
}) => {
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Get elevation style
  const getElevationStyle = () => {
    if (!showShadow) return {};
    
    const shadowMap = {
      none: {},
      sm: theme.shadows.sm,
      md: theme.shadows.md,
      lg: theme.shadows.lg,
      xl: theme.shadows.xl,
    };
    
    return shadowMap[elevation] || theme.shadows.md;
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderContactInfo = () => (
    <View style={styles.contactInfo}>
      <View style={styles.contactRow}>
        <Ionicons name="mail-outline" size={16} color={cardTheme.textColor} style={styles.icon} />
        <Text 
          style={[
            styles.contactText, 
            { 
              color: cardTheme.textColor,
              fontFamily: cardTheme.fontFamily || theme.typography.fontFamily.sans,
            }
          ]}
          numberOfLines={1}
          accessibilityLabel={`Email: ${profile.email}`}
        >
          {profile.email}
        </Text>
      </View>
      <View style={styles.contactRow}>
        <Ionicons name="call-outline" size={16} color={cardTheme.textColor} style={styles.icon} />
        <Text 
          style={[
            styles.contactText, 
            { 
              color: cardTheme.textColor,
              fontFamily: cardTheme.fontFamily || theme.typography.fontFamily.sans,
            }
          ]}
          numberOfLines={1}
          accessibilityLabel={`Phone: ${profile.phone}`}
        >
          {profile.phone}
        </Text>
      </View>
      {profile.website && (
        <View style={styles.contactRow}>
          <Ionicons name="globe-outline" size={16} color={cardTheme.textColor} style={styles.icon} />
          <Text 
            style={[
              styles.contactText, 
              { 
                color: cardTheme.textColor,
                fontFamily: cardTheme.fontFamily || theme.typography.fontFamily.sans,
              }
            ]}
            numberOfLines={1}
            accessibilityLabel={`Website: ${profile.website}`}
          >
            {profile.website}
          </Text>
        </View>
      )}
      {profile.address && (
        <View style={styles.contactRow}>
          <Ionicons name="location-outline" size={16} color={cardTheme.textColor} style={styles.icon} />
          <Text 
            style={[
              styles.contactText, 
              { 
                color: cardTheme.textColor,
                fontFamily: cardTheme.fontFamily || theme.typography.fontFamily.sans,
              }
            ]}
            numberOfLines={1}
            accessibilityLabel={`Address: ${profile.address}`}
          >
            {profile.address}
          </Text>
        </View>
      )}
    </View>
  );

  const renderSocialIcons = () => {
    if (!profile.socialLinks) return null;
    
    const socialIcons = [
      { key: 'linkedin', icon: 'logo-linkedin', url: profile.socialLinks.linkedin },
      { key: 'twitter', icon: 'logo-twitter', url: profile.socialLinks.twitter },
      { key: 'facebook', icon: 'logo-facebook', url: profile.socialLinks.facebook },
      { key: 'instagram', icon: 'logo-instagram', url: profile.socialLinks.instagram },
      { key: 'github', icon: 'logo-github', url: profile.socialLinks.github },
      { key: 'dribbble', icon: 'logo-dribbble', url: profile.socialLinks.dribbble },
    ].filter(item => item.url);
    
    if (socialIcons.length === 0) return null;
    
    return (
      <View style={styles.socialIcons}>
        {socialIcons.map((item) => (
          <TouchableOpacity 
            key={item.key}
            style={[
              styles.socialIcon,
              { backgroundColor: `${cardTheme.textColor}20` }
            ]}
            accessibilityLabel={`${item.key} profile`}
            accessibilityRole="button"
          >
            <Ionicons name={item.icon as any} size={18} color={cardTheme.textColor} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [{ scale: scaleAnim }, { scale }],
          borderRadius: borderRadius,
          ...getElevationStyle(),
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`Business card for ${profile.name}`}
        accessibilityHint="Double tap to view details"
      >
        <LinearGradient
          colors={cardTheme.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            { borderRadius: borderRadius },
            cardTheme.layout === 'vertical' ? styles.verticalCard : styles.horizontalCard,
          ]}
        >
          {showBadge && (
            <View style={styles.badgeContainer}>
              <Badge 
                label={badgeText || 'New'} 
                size="sm" 
                variant="solid" 
                backgroundColor={cardTheme.accentColor || '#ffffff'}
                textColor={cardTheme.colors[0]}
                rounded
              />
            </View>
          )}
          
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <Avatar 
                source={profile.photoUri}
                name={profile.name}
                size={cardTheme.layout === 'vertical' ? 'lg' : 'md'}
                borderColor={`${cardTheme.textColor}50`}
                borderWidth={2}
                style={styles.avatar}
              />
              
              <View style={styles.headerText}>
                <Text 
                  style={[
                    styles.name, 
                    { 
                      color: cardTheme.textColor,
                      fontFamily: cardTheme.fontFamily || theme.typography.fontFamily.sans,
                    }
                  ]}
                  accessibilityLabel={`Name: ${profile.name}`}
                >
                  {profile.name}
                </Text>
                <Text 
                  style={[
                    styles.title, 
                    { 
                      color: cardTheme.textColor,
                      fontFamily: cardTheme.fontFamily || theme.typography.fontFamily.sans,
                    }
                  ]}
                  accessibilityLabel={`Title: ${profile.title}`}
                >
                  {profile.title}
                </Text>
                <Text 
                  style={[
                    styles.company, 
                    { 
                      color: cardTheme.textColor,
                      fontFamily: cardTheme.fontFamily || theme.typography.fontFamily.sans,
                    }
                  ]}
                  accessibilityLabel={`Company: ${profile.company}`}
                >
                  {profile.company}
                </Text>
              </View>
              
              {profile.logoUri && (
                <Image 
                  source={{ uri: profile.logoUri }} 
                  style={[
                    styles.logo,
                    { backgroundColor: `${cardTheme.textColor}20` }
                  ]}
                  accessibilityLabel={`${profile.company} logo`}
                />
              )}
            </View>
            
            {renderContactInfo()}
            {renderSocialIcons()}
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {isEditable && (
        <TouchableOpacity 
          style={[
            styles.editButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={onEdit}
          accessibilityLabel="Edit business card"
          accessibilityRole="button"
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  card: {
    overflow: 'hidden',
  },
  horizontalCard: {
    aspectRatio: 1.7 / 1,
    padding: 24,
  },
  verticalCard: {
    aspectRatio: 0.65 / 1,
    padding: 24,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
    opacity: 0.9,
  },
  company: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  contactInfo: {
    marginTop: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    opacity: 0.9,
  },
  contactText: {
    fontSize: 14,
    flex: 1,
    opacity: 0.9,
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 8,
  },
  editButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
});

export default CardPreview;