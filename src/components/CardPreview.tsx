import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BusinessCard } from '../types/businessCard';
import { useTheme } from '../styles/ThemeProvider';

interface CardPreviewProps {
  card: BusinessCard;
  small?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({ card, small = false }) => {
  const { theme } = useTheme();
  
  // Default template if none is specified
  const template = card.template || {
    id: 'default',
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      background: theme.colors.card,
      text: theme.colors.text,
      accent: theme.colors.primary,
    },
    fonts: {
      primary: 'System',
      secondary: 'System',
    },
    layout: 'horizontal',
  };
  
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get gradient colors based on template
  const gradientColors = [
    template.colors.primary,
    template.colors.secondary || template.colors.primary,
  ];
  
  // Determine if the layout is vertical or horizontal
  const isVertical = template.layout === 'vertical';
  
  return (
    <View style={[
      styles.container,
      small && styles.smallContainer,
      { backgroundColor: template.colors.background }
    ]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          isVertical ? styles.verticalGradient : styles.horizontalGradient,
          small && styles.smallGradient
        ]}
      />
      
      <View style={[
        styles.content,
        isVertical ? styles.verticalContent : styles.horizontalContent,
        small && styles.smallContent
      ]}>
        <View style={[
          styles.avatarContainer,
          small && styles.smallAvatarContainer,
          { backgroundColor: template.colors.primary }
        ]}>
          <Text style={[
            styles.avatarText,
            small && styles.smallAvatarText
          ]}>
            {getInitials(card.name)}
          </Text>
        </View>
        
        <View style={[
          styles.infoContainer,
          small && styles.smallInfoContainer
        ]}>
          <Text 
            style={[
              styles.name,
              small && styles.smallName,
              { color: isVertical ? '#fff' : template.colors.text }
            ]}
            numberOfLines={1}
          >
            {card.name}
          </Text>
          
          {card.title ? (
            <Text 
              style={[
                styles.title,
                small && styles.smallTitle,
                { color: isVertical ? '#fff' : theme.colors.textSecondary }
              ]}
              numberOfLines={1}
            >
              {card.title}
            </Text>
          ) : null}
          
          {card.company && !small ? (
            <Text 
              style={[
                styles.company,
                { color: isVertical ? '#fff' : theme.colors.primary }
              ]}
              numberOfLines={1}
            >
              {card.company}
            </Text>
          ) : null}
          
          {!small && (
            <View style={styles.contactInfo}>
              {card.phone && (
                <View style={styles.contactRow}>
                  <Ionicons 
                    name="call-outline" 
                    size={14} 
                    color={isVertical ? '#fff' : theme.colors.textSecondary} 
                    style={styles.contactIcon} 
                  />
                  <Text 
                    style={[
                      styles.contactText,
                      { color: isVertical ? '#fff' : theme.colors.textSecondary }
                    ]}
                    numberOfLines={1}
                  >
                    {card.phone}
                  </Text>
                </View>
              )}
              
              {card.email && (
                <View style={styles.contactRow}>
                  <Ionicons 
                    name="mail-outline" 
                    size={14} 
                    color={isVertical ? '#fff' : theme.colors.textSecondary} 
                    style={styles.contactIcon} 
                  />
                  <Text 
                    style={[
                      styles.contactText,
                      { color: isVertical ? '#fff' : theme.colors.textSecondary }
                    ]}
                    numberOfLines={1}
                  >
                    {card.email}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
  },
  smallContainer: {
    height: 100,
  },
  gradient: {
    position: 'absolute',
  },
  horizontalGradient: {
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
  },
  verticalGradient: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  smallGradient: {
    width: '25%',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  horizontalContent: {
    flexDirection: 'row',
  },
  verticalContent: {
    flexDirection: 'row',
  },
  smallContent: {
    padding: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  smallAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  smallAvatarText: {
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  smallInfoContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  smallName: {
    fontSize: 14,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 12,
    marginBottom: 0,
  },
  company: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactIcon: {
    marginRight: 6,
  },
  contactText: {
    fontSize: 12,
  },
});

export default CardPreview;