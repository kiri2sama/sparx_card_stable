import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { BusinessCard } from '../types/businessCard';

type TemplateGalleryParams = {
  businessCard?: BusinessCard;
  onSelectTemplate?: (templateId: string) => void;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

const TemplateGalleryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const { businessCard, onSelectTemplate } = route.params as TemplateGalleryParams || {};
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    businessCard?.template?.id || 'elegant-purple'
  );
  
  const templates = [
    {
      id: 'elegant-purple',
      name: 'Elegant Purple',
      colors: ['#6D28D9', '#4C1D95'],
      layout: 'horizontal',
    },
    {
      id: 'facebook-blue',
      name: 'Facebook Blue',
      colors: ['#1877F2', '#166FE5'],
      layout: 'horizontal',
    },
    {
      id: 'teal-breeze',
      name: 'Teal Breeze',
      colors: ['#14B8A6', '#0F766E'],
      layout: 'horizontal',
    },
    {
      id: 'midnight',
      name: 'Midnight',
      colors: ['#0F172A', '#1E293B'],
      layout: 'horizontal',
    },
    {
      id: 'sunset',
      name: 'Sunset',
      colors: ['#F97316', '#C2410C'],
      layout: 'horizontal',
    },
    {
      id: 'emerald',
      name: 'Emerald',
      colors: ['#10B981', '#047857'],
      layout: 'horizontal',
    },
    {
      id: 'royal-purple',
      name: 'Royal Purple',
      colors: ['#8B5CF6', '#6D28D9'],
      layout: 'horizontal',
    },
    {
      id: 'minimal-light',
      name: 'Minimal Light',
      colors: ['#F9FAFB', '#F3F4F6'],
      textColor: '#111827',
      layout: 'horizontal',
    },
    {
      id: 'vertical-purple',
      name: 'Vertical Purple',
      colors: ['#8B5CF6', '#6D28D9'],
      layout: 'vertical',
    },
    {
      id: 'vertical-blue',
      name: 'Vertical Blue',
      colors: ['#1877F2', '#166FE5'],
      layout: 'vertical',
    },
    {
      id: 'vertical-teal',
      name: 'Vertical Teal',
      colors: ['#14B8A6', '#0F766E'],
      layout: 'vertical',
    },
    {
      id: 'vertical-dark',
      name: 'Vertical Dark',
      colors: ['#1F2937', '#111827'],
      layout: 'vertical',
    },
  ];
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    } else {
      // If we have a business card, update it with the new template
      if (businessCard) {
        const template = templates.find(t => t.id === templateId);
        if (template) {
          const updatedCard: BusinessCard = {
            ...businessCard,
            template: {
              id: template.id,
              colors: {
                primary: template.colors[0],
                secondary: template.colors[1],
                background: template.textColor ? template.colors[0] : '#FFFFFF',
                text: template.textColor || '#FFFFFF',
                accent: template.colors[0],
              },
              fonts: {
                primary: 'System',
                secondary: 'System',
              },
              layout: template.layout,
            },
          };
          
          navigation.navigate('NFCWriter' as never, { 
            editMode: true, 
            businessCard: updatedCard 
          } as never);
        }
      }
    }
  };
  
  const renderTemplateItem = ({ item }: { item: typeof templates[0] }) => {
    const isSelected = selectedTemplate === item.id;
    const isVertical = item.layout === 'vertical';
    const textColor = item.textColor || '#FFFFFF';
    
    return (
      <TouchableOpacity
        style={[
          styles.templateItem,
          isSelected && { borderColor: theme.colors.primary, borderWidth: 3 }
        ]}
        onPress={() => handleSelectTemplate(item.id)}
        accessibilityLabel={`${item.name} template`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <View style={styles.templateCard}>
          <LinearGradient
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.templateGradient,
              isVertical ? styles.verticalGradient : styles.horizontalGradient
            ]}
          />
          
          <View style={[
            styles.templateContent,
            isVertical && { paddingLeft: CARD_WIDTH * 0.3 }
          ]}>
            <View style={[
              styles.avatarPlaceholder,
              { backgroundColor: isVertical ? 'rgba(255,255,255,0.2)' : item.colors[0] }
            ]}>
              <Text style={[styles.avatarText, { color: textColor }]}>AB</Text>
            </View>
            
            <View style={styles.templateTextContent}>
              <View style={styles.templateTextLine} />
              <View style={[styles.templateTextLine, { width: '70%' }]} />
              <View style={styles.templateTextLine} />
            </View>
          </View>
        </View>
        
        <Text style={[styles.templateName, { color: theme.colors.text }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Card Templates
        </Text>
        
        <View style={styles.headerRight} />
      </View>
      
      <FlatList
        data={templates}
        renderItem={renderTemplateItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.templateList}
        numColumns={2}
      />
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  templateList: {
    padding: 16,
    paddingBottom: 100,
  },
  templateItem: {
    width: '50%',
    padding: 8,
    marginBottom: 16,
  },
  templateCard: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  templateGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  horizontalGradient: {
    width: '30%',
  },
  verticalGradient: {
    width: '100%',
  },
  templateContent: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  templateTextContent: {
    flex: 1,
    justifyContent: 'center',
  },
  templateTextLine: {
    height: 6,
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 6,
    borderRadius: 3,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TemplateGalleryScreen;