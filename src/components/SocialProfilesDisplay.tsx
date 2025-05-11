import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BusinessCard } from '../types/businessCard';
import { getSocialIcon, formatSocialPlatformName, openSocialProfile } from '../utils/socialUtils';

interface SocialProfilesDisplayProps {
  socialProfiles?: BusinessCard['socialProfiles'];
  iconSize?: number;
  iconColor?: string;
  showLabels?: boolean;
  horizontal?: boolean;
}

const SocialProfilesDisplay: React.FC<SocialProfilesDisplayProps> = ({
  socialProfiles,
  iconSize = 24,
  iconColor = '#0066cc',
  showLabels = true,
  horizontal = false
}) => {
  if (!socialProfiles || Object.keys(socialProfiles).length === 0) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      horizontal ? styles.horizontalContainer : styles.verticalContainer
    ]}>
      {showLabels && !horizontal && (
        <Text style={styles.sectionTitle}>Social Profiles</Text>
      )}
      
      <View style={[
        styles.profilesContainer,
        horizontal ? styles.horizontalProfilesContainer : styles.verticalProfilesContainer
      ]}>
        {Object.entries(socialProfiles).map(([platform, url]) => (
          <TouchableOpacity
            key={platform}
            style={[
              styles.profileItem,
              horizontal ? styles.horizontalProfileItem : styles.verticalProfileItem
            ]}
            onPress={() => openSocialProfile(url)}
            accessibilityLabel={`${formatSocialPlatformName(platform)} profile`}
            accessibilityRole="link"
          >
            <Ionicons
              name={getSocialIcon(platform) as any}
              size={iconSize}
              color={iconColor}
              style={styles.icon}
            />
            
            {showLabels && (
              <Text style={styles.profileLabel}>
                {formatSocialPlatformName(platform)}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  horizontalContainer: {
    flexDirection: 'column',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  profilesContainer: {
    flexWrap: 'wrap',
  },
  horizontalProfilesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  verticalProfilesContainer: {
    flexDirection: 'column',
  },
  profileItem: {
    alignItems: 'center',
  },
  horizontalProfileItem: {
    marginRight: 16,
    marginBottom: 8,
  },
  verticalProfileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  profileLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default SocialProfilesDisplay;