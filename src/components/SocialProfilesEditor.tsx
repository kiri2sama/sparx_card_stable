import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { BusinessCard } from '../types/businessCard';

interface SocialProfilesEditorProps {
  businessCard: BusinessCard;
  onSave: (updatedCard: BusinessCard) => void;
  onCancel: () => void;
}

// Social media platforms with their icons and placeholder URLs
const socialPlatforms = [
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: 'logo-linkedin', 
    placeholder: 'https://linkedin.com/in/username' 
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: 'logo-twitter', 
    placeholder: 'https://twitter.com/username' 
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: 'logo-instagram', 
    placeholder: 'https://instagram.com/username' 
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: 'logo-facebook', 
    placeholder: 'https://facebook.com/username' 
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    icon: 'logo-github', 
    placeholder: 'https://github.com/username' 
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: 'logo-youtube', 
    placeholder: 'https://youtube.com/c/channelname' 
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: 'logo-tiktok', 
    placeholder: 'https://tiktok.com/@username' 
  },
  { 
    id: 'snapchat', 
    name: 'Snapchat', 
    icon: 'logo-snapchat', 
    placeholder: 'https://snapchat.com/add/username' 
  },
  { 
    id: 'pinterest', 
    name: 'Pinterest', 
    icon: 'logo-pinterest', 
    placeholder: 'https://pinterest.com/username' 
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    icon: 'logo-medium', 
    placeholder: 'https://medium.com/@username' 
  }
];

const SocialProfilesEditor: React.FC<SocialProfilesEditorProps> = ({ 
  businessCard, 
  onSave, 
  onCancel 
}) => {
  // Initialize social profiles from the business card or create an empty object
  const [socialProfiles, setSocialProfiles] = useState<BusinessCard['socialProfiles']>(
    businessCard.socialProfiles || {}
  );
  
  // Handle updating a specific social profile URL
  const updateProfile = (platformId: string, url: string) => {
    setSocialProfiles({
      ...socialProfiles,
      [platformId]: url
    });
  };
  
  // Clear a specific social profile
  const clearProfile = (platformId: string) => {
    const updatedProfiles = { ...socialProfiles };
    delete updatedProfiles[platformId];
    setSocialProfiles(updatedProfiles);
  };
  
  // Handle saving all social profiles
  const handleSave = () => {
    // Filter out empty URLs
    const filteredProfiles = Object.entries(socialProfiles).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value.trim();
      }
      return acc;
    }, {} as Record<string, string>);
    
    const updatedCard: BusinessCard = {
      ...businessCard,
      socialProfiles: Object.keys(filteredProfiles).length > 0 ? filteredProfiles : undefined
    };
    
    onSave(updatedCard);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Social Media Profiles</Text>
      <Text style={styles.subtitle}>Add your social media profiles to your business card</Text>
      
      <View style={styles.profilesContainer}>
        {socialPlatforms.map(platform => {
          const profileUrl = socialProfiles?.[platform.id as keyof typeof socialProfiles] || '';
          
          return (
            <View key={platform.id} style={styles.profileRow}>
              <View style={styles.platformInfo}>
                <Ionicons name={platform.icon as any} size={24} color="#0066cc" style={styles.platformIcon} />
                <Text style={styles.platformName}>{platform.name}</Text>
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  value={profileUrl}
                  onChangeText={(text) => updateProfile(platform.id, text)}
                  placeholder={platform.placeholder}
                  style={styles.input}
                  dense
                  right={
                    profileUrl ? (
                      <TextInput.Icon 
                        icon="close-circle" 
                        onPress={() => clearProfile(platform.id)} 
                      />
                    ) : null
                  }
                />
              </View>
            </View>
          );
        })}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          onPress={onCancel} 
          style={styles.button}
        >
          Cancel
        </Button>
        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.button}
        >
          Save Profiles
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  profilesContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileRow: {
    marginBottom: 16,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  platformIcon: {
    marginRight: 8,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    width: '48%',
  },
});

export default SocialProfilesEditor;