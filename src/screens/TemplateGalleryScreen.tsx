import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import CardPreview, { CardProfile, CardTheme } from '../components/CardPreview';
import TemplateGrid from '../components/TemplateGrid';

const { width } = Dimensions.get('window');

// Mock user profile data
const mockProfile: CardProfile = {
  name: 'John Doe',
  title: 'Senior Developer',
  company: 'Tech Solutions Inc.',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  website: 'www.johndoe.dev',
  address: '123 Tech Street, San Francisco, CA',
  photoUri: 'https://randomuser.me/api/portraits/men/32.jpg',
  logoUri: 'https://logo.clearbit.com/microsoft.com',
  socialLinks: {
    linkedin: 'linkedin.com/in/johndoe',
    twitter: 'twitter.com/johndoe',
  },
};

// Mock template data
const mockTemplates: CardTheme[] = [
  {
    id: 'template1',
    name: 'Blue Gradient',
    colors: ['#0066cc', '#4da6ff'],
    textColor: '#ffffff',
    layout: 'horizontal',
  },
  {
    id: 'template2',
    name: 'Green Success',
    colors: ['#28a745', '#5fd778'],
    textColor: '#ffffff',
    layout: 'horizontal',
  },
  {
    id: 'template3',
    name: 'Sunset',
    colors: ['#ff7e5f', '#feb47b'],
    textColor: '#ffffff',
    layout: 'horizontal',
  },
  {
    id: 'template4',
    name: 'Dark Mode',
    colors: ['#232526', '#414345'],
    textColor: '#ffffff',
    layout: 'horizontal',
  },
  {
    id: 'template5',
    name: 'Purple Rain',
    colors: ['#8e2de2', '#4a00e0'],
    textColor: '#ffffff',
    layout: 'horizontal',
  },
  {
    id: 'template6',
    name: 'Coral Reef',
    colors: ['#ff5f6d', '#ffc371'],
    textColor: '#ffffff',
    layout: 'horizontal',
  },
  {
    id: 'template7',
    name: 'Vertical Blue',
    colors: ['#2193b0', '#6dd5ed'],
    textColor: '#ffffff',
    layout: 'vertical',
  },
  {
    id: 'template8',
    name: 'Vertical Green',
    colors: ['#11998e', '#38ef7d'],
    textColor: '#ffffff',
    layout: 'vertical',
  },
];

type TemplateGalleryScreenProps = {
  navigation: any;
  route: any;
};

const TemplateGalleryScreen: React.FC<TemplateGalleryScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<CardTheme>(mockTemplates[0]);
  const [profile, setProfile] = useState<CardProfile>(mockProfile);
  const [showPreview, setShowPreview] = useState(true);
  
  // Animation values
  const previewScaleAnim = React.useRef(new Animated.Value(1)).current;
  const previewOpacityAnim = React.useRef(new Animated.Value(1)).current;
  
  // Get profile data from route params if available
  useEffect(() => {
    if (route.params?.profile) {
      setProfile(route.params.profile);
    }
  }, [route.params]);
  
  // Handle template selection
  const handleTemplateSelect = (template: CardTheme) => {
    // Animate card preview change
    Animated.sequence([
      Animated.parallel([
        Animated.timing(previewScaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(previewOpacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(previewScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(previewOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Update selected template
    setSelectedTemplate(template);
  };
  
  // Toggle preview visibility
  const togglePreview = () => {
    if (showPreview) {
      Animated.parallel([
        Animated.timing(previewScaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(previewOpacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowPreview(false);
      });
    } else {
      setShowPreview(true);
      Animated.parallel([
        Animated.timing(previewScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(previewOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  // Save template selection
  const saveTemplateSelection = () => {
    // Here you would typically save the template selection to storage
    // For now, we'll just navigate back with the selected template
    navigation.navigate('Profile', {
      selectedTemplate: selectedTemplate,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Card Templates
        </Text>
        
        <TouchableOpacity
          onPress={togglePreview}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          accessibilityLabel={showPreview ? "Hide preview" : "Show preview"}
          accessibilityRole="button"
        >
          <Ionicons 
            name={showPreview ? "eye-off-outline" : "eye-outline"} 
            size={24} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
      </View>
      
      {showPreview && (
        <Animated.View 
          style={[
            styles.previewContainer,
            { 
              opacity: previewOpacityAnim,
              transform: [{ scale: previewScaleAnim }],
            }
          ]}
        >
          <CardPreview
            profile={profile}
            cardTheme={selectedTemplate}
            scale={0.9}
          />
        </Animated.View>
      )}
      
      <View style={styles.templatesContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Choose a Template
        </Text>
        
        <TemplateGrid
          templates={mockTemplates}
          selectedTemplateId={selectedTemplate.id}
          onSelect={handleTemplateSelect}
        />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={saveTemplateSelection}
          accessibilityLabel="Apply template"
          accessibilityRole="button"
        >
          <Text style={styles.saveButtonText}>Apply Template</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  templatesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TemplateGalleryScreen;