import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { BusinessCard } from '../types/businessCard';

interface SocialProfilesEditorProps {
  businessCard: BusinessCard;
  onSave: (updatedCard: BusinessCard) => void;
  onCancel: () => void;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  placeholder: string;
  color: string;
}

const SocialProfilesEditor: React.FC<SocialProfilesEditorProps> = ({ 
  businessCard, 
  onSave, 
  onCancel 
}) => {
  const { theme } = useTheme();
  
  const [profiles, setProfiles] = useState<Record<string, string>>(
    businessCard.socialProfiles || {}
  );
  
  const socialPlatforms: SocialPlatform[] = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: 'logo-linkedin', 
      placeholder: 'https://linkedin.com/in/username',
      color: '#0077B5'
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: 'logo-twitter', 
      placeholder: 'https://twitter.com/username',
      color: '#1DA1F2'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: 'logo-facebook', 
      placeholder: 'https://facebook.com/username',
      color: '#1877F2'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: 'logo-instagram', 
      placeholder: 'https://instagram.com/username',
      color: '#E1306C'
    },
    { 
      id: 'github', 
      name: 'GitHub', 
      icon: 'logo-github', 
      placeholder: 'https://github.com/username',
      color: '#333333'
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: 'logo-youtube', 
      placeholder: 'https://youtube.com/c/channelname',
      color: '#FF0000'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: 'logo-tiktok', 
      placeholder: 'https://tiktok.com/@username',
      color: '#000000'
    },
    { 
      id: 'website', 
      name: 'Website', 
      icon: 'globe-outline', 
      placeholder: 'https://yourwebsite.com',
      color: '#4CAF50'
    },
  ];
  
  const handleUpdateProfile = (platformId: string, url: string) => {
    const updatedProfiles = { ...profiles };
    
    if (url.trim() === '') {
      // Remove the profile if the URL is empty
      delete updatedProfiles[platformId];
    } else {
      // Add or update the profile
      updatedProfiles[platformId] = url;
    }
    
    setProfiles(updatedProfiles);
  };
  
  const handleSave = () => {
    // Validate URLs
    const invalidUrls: string[] = [];
    
    Object.entries(profiles).forEach(([platform, url]) => {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        invalidUrls.push(platform);
      }
    });
    
    if (invalidUrls.length > 0) {
      Alert.alert(
        'Invalid URLs',
        `Please enter valid URLs for: ${invalidUrls.join(', ')}`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Save the updated profiles
    const updatedCard: BusinessCard = {
      ...businessCard,
      socialProfiles: profiles
    };
    
    onSave(updatedCard);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={onCancel}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.error }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Social Profiles
        </Text>
        
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleSave}
          accessibilityLabel="Save"
          accessibilityRole="button"
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.primary }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Add your social media profiles to your business card. Leave fields blank to remove them.
        </Text>
        
        {socialPlatforms.map((platform) => (
          <View key={platform.id} style={styles.profileInputContainer}>
            <View style={[styles.platformIconContainer, { backgroundColor: platform.color }]}>
              <Ionicons name={platform.icon as any} size={24} color="#fff" />
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={[styles.platformName, { color: theme.colors.text }]}>
                {platform.name}
              </Text>
              
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
                value={profiles[platform.id] || ''}
                onChangeText={(text) => handleUpdateProfile(platform.id, text)}
                placeholder={platform.placeholder}
                placeholderTextColor={theme.colors.placeholder}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    maxHeight: '80%',
  },
  scrollContent: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
  },
  profileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  platformIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
});

export default SocialProfilesEditor;