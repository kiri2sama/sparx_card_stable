import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessCard } from '../types/businessCard';
import CardPreview from '../components/CardPreview';
import { saveBusinessCard, updateBusinessCard } from '../utils/storageUtils';
import SocialProfilesEditor from '../components/SocialProfilesEditor';

type CardEditorParams = {
  editMode?: boolean;
  businessCard?: BusinessCard;
};

const CardEditorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const { editMode, businessCard } = route.params as CardEditorParams || {};
  
  const [card, setCard] = useState<BusinessCard>({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    notes: '',
    additionalPhones: [],
    additionalEmails: [],
    additionalWebsites: [],
    socialProfiles: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  
  const [showSocialEditor, setShowSocialEditor] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  useEffect(() => {
    if (editMode && businessCard) {
      setCard(businessCard);
    }
  }, [editMode, businessCard]);
  
  const handleSave = async () => {
    if (!card.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    try {
      const updatedCard = {
        ...card,
        updatedAt: Date.now(),
      };
      
      let success;
      if (editMode && card.id) {
        success = await updateBusinessCard(updatedCard);
      } else {
        success = await saveBusinessCard(updatedCard);
      }
      
      if (success) {
        Alert.alert(
          'Success',
          editMode ? 'Card updated successfully' : 'Card created successfully',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', 'Failed to save card');
      }
    } catch (error) {
      console.error('Error saving card:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  
  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() }
      ]
    );
  };
  
  const handleSocialProfilesSave = (updatedCard: BusinessCard) => {
    setCard(updatedCard);
    setShowSocialEditor(false);
  };
  
  const handleTemplateSelect = (templateId: string) => {
    // This would be implemented when we have the template gallery
    setShowTemplateSelector(false);
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleCancel}
            accessibilityLabel="Cancel"
            accessibilityRole="button"
          >
            <Text style={[styles.headerButtonText, { color: theme.colors.error }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {editMode ? 'Edit Card' : 'Create Card'}
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
          {/* Card Preview */}
          <View style={[styles.previewContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Preview
            </Text>
            <CardPreview card={card} />
          </View>
          
          {/* Basic Information */}
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Basic Information
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Name *
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
                value={card.name}
                onChangeText={(text) => setCard({ ...card, name: text })}
                placeholder="Full Name"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Title
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
                value={card.title}
                onChangeText={(text) => setCard({ ...card, title: text })}
                placeholder="Job Title"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Company
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
                value={card.company}
                onChangeText={(text) => setCard({ ...card, company: text })}
                placeholder="Company Name"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
          </View>
          
          {/* Contact Information */}
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Contact Information
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Phone
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
                value={card.phone}
                onChangeText={(text) => setCard({ ...card, phone: text })}
                placeholder="Phone Number"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Email
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
                value={card.email}
                onChangeText={(text) => setCard({ ...card, email: text })}
                placeholder="Email Address"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Website
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
                value={card.website}
                onChangeText={(text) => setCard({ ...card, website: text })}
                placeholder="Website URL"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          {/* Social Profiles */}
          <TouchableOpacity
            style={[styles.section, { backgroundColor: theme.colors.card }]}
            onPress={() => setShowSocialEditor(true)}
            accessibilityLabel="Edit social profiles"
            accessibilityRole="button"
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Social Profiles
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            </View>
            
            <View style={styles.socialPreview}>
              {card.socialProfiles && Object.keys(card.socialProfiles).length > 0 ? (
                <View style={styles.socialProfilesList}>
                  {Object.entries(card.socialProfiles).map(([platform, url]) => (
                    <View key={platform} style={styles.socialProfileItem}>
                      <Ionicons 
                        name={`logo-${platform.toLowerCase()}`} 
                        size={20} 
                        color={theme.colors.primary} 
                        style={styles.socialIcon} 
                      />
                      <Text 
                        style={[styles.socialPlatform, { color: theme.colors.text }]}
                        numberOfLines={1}
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  Add your social media profiles
                </Text>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Card Template */}
          <TouchableOpacity
            style={[styles.section, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('TemplateGallery' as never)}
            accessibilityLabel="Choose card template"
            accessibilityRole="button"
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Card Template
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            </View>
            
            <Text style={[styles.templateName, { color: theme.colors.textSecondary }]}>
              {card.template?.id ? card.template.id.charAt(0).toUpperCase() + card.template.id.slice(1) : 'Default Template'}
            </Text>
          </TouchableOpacity>
          
          {/* Notes */}
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Notes
            </Text>
            
            <TextInput
              style={[
                styles.notesInput,
                { 
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border
                }
              ]}
              value={card.notes}
              onChangeText={(text) => setCard({ ...card, notes: text })}
              placeholder="Add notes about this contact..."
              placeholderTextColor={theme.colors.placeholder}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
        
        {/* Social Profiles Editor Modal */}
        {showSocialEditor && (
          <View style={styles.modalContainer}>
            <SocialProfilesEditor
              businessCard={card}
              onSave={handleSocialProfilesSave}
              onCancel={() => setShowSocialEditor(false)}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  previewContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  socialPreview: {
    minHeight: 40,
    justifyContent: 'center',
  },
  socialProfilesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  socialProfileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  socialIcon: {
    marginRight: 6,
  },
  socialPlatform: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  templateName: {
    fontSize: 14,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default CardEditorScreen;