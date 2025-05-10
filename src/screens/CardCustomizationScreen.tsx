import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Switch
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { BusinessCard } from '../types/businessCard';
import ColorPicker from '../components/ColorPicker';
import FontSelector from '../components/FontSelector';

type CardCustomizationParams = {
  businessCard: BusinessCard;
  onSave: (updatedCard: BusinessCard) => void;
};

const CardCustomizationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  
  const { businessCard, onSave } = route.params as CardCustomizationParams || {};
  
  const [card, setCard] = useState<BusinessCard>(businessCard || {
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    notes: '',
    template: {
      id: 'custom',
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        background: '#FFFFFF',
        text: '#000000',
        accent: theme.colors.primary,
      },
      fonts: {
        primary: 'System',
        secondary: 'System',
      },
      layout: 'horizontal',
    }
  });
  
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors');
  const [primaryColor, setPrimaryColor] = useState(card.template?.colors.primary || theme.colors.primary);
  const [secondaryColor, setSecondaryColor] = useState(card.template?.colors.secondary || theme.colors.secondary);
  const [backgroundColor, setBackgroundColor] = useState(card.template?.colors.background || '#FFFFFF');
  const [textColor, setTextColor] = useState(card.template?.colors.text || '#000000');
  const [isVerticalLayout, setIsVerticalLayout] = useState(card.template?.layout === 'vertical');
  
  const handleSave = () => {
    const updatedCard: BusinessCard = {
      ...card,
      template: {
        id: 'custom',
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          background: backgroundColor,
          text: textColor,
          accent: primaryColor,
        },
        fonts: {
          primary: card.template?.fonts.primary || 'System',
          secondary: card.template?.fonts.secondary || 'System',
        },
        layout: isVerticalLayout ? 'vertical' : 'horizontal',
      }
    };
    
    if (onSave) {
      onSave(updatedCard);
    } else {
      navigation.navigate('CardEditor' as never, { 
        businessCard: updatedCard,
        editMode: true
      } as never);
    }
  };
  
  const renderColorsTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Primary Color
      </Text>
      <ColorPicker
        color={primaryColor}
        onColorChange={setPrimaryColor}
        presetColors={[
          '#1877F2', // Facebook blue
          '#6D28D9', // Purple
          '#10B981', // Green
          '#F97316', // Orange
          '#EF4444', // Red
          '#0EA5E9', // Light blue
          '#8B5CF6', // Violet
          '#000000', // Black
        ]}
      />
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Secondary Color
      </Text>
      <ColorPicker
        color={secondaryColor}
        onColorChange={setSecondaryColor}
        presetColors={[
          '#166FE5', // Darker Facebook blue
          '#4C1D95', // Dark purple
          '#047857', // Dark green
          '#C2410C', // Dark orange
          '#B91C1C', // Dark red
          '#0369A1', // Dark light blue
          '#6D28D9', // Dark violet
          '#4B5563', // Dark gray
        ]}
      />
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Background Color
      </Text>
      <ColorPicker
        color={backgroundColor}
        onColorChange={setBackgroundColor}
        presetColors={[
          '#FFFFFF', // White
          '#F9FAFB', // Off-white
          '#F3F4F6', // Light gray
          '#E5E7EB', // Gray
          '#1F2937', // Dark gray
          '#111827', // Almost black
          '#ECFDF5', // Light green
          '#EFF6FF', // Light blue
        ]}
      />
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Text Color
      </Text>
      <ColorPicker
        color={textColor}
        onColorChange={setTextColor}
        presetColors={[
          '#000000', // Black
          '#1F2937', // Dark gray
          '#4B5563', // Medium gray
          '#6B7280', // Gray
          '#9CA3AF', // Light gray
          '#F9FAFB', // Off-white
          '#FFFFFF', // White
          '#1877F2', // Facebook blue
        ]}
      />
    </View>
  );
  
  const renderFontsTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Primary Font
      </Text>
      <FontSelector
        selectedFont={card.template?.fonts.primary || 'System'}
        onSelectFont={(font) => {
          setCard({
            ...card,
            template: {
              ...card.template!,
              fonts: {
                ...card.template!.fonts,
                primary: font,
              }
            }
          });
        }}
      />
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Secondary Font
      </Text>
      <FontSelector
        selectedFont={card.template?.fonts.secondary || 'System'}
        onSelectFont={(font) => {
          setCard({
            ...card,
            template: {
              ...card.template!,
              fonts: {
                ...card.template!.fonts,
                secondary: font,
              }
            }
          });
        }}
      />
      
      <Text style={[styles.note, { color: theme.colors.textSecondary }]}>
        Note: Font availability may vary depending on the device.
      </Text>
    </View>
  );
  
  const renderLayoutTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Card Layout
      </Text>
      
      <View style={styles.layoutOptions}>
        <TouchableOpacity
          style={[
            styles.layoutOption,
            !isVerticalLayout && { borderColor: theme.colors.primary, borderWidth: 2 }
          ]}
          onPress={() => setIsVerticalLayout(false)}
        >
          <View style={styles.layoutPreview}>
            <View style={styles.horizontalLayoutPreview}>
              <View style={[styles.layoutColorBar, { backgroundColor: primaryColor }]} />
              <View style={styles.layoutContent} />
            </View>
          </View>
          <Text style={[styles.layoutLabel, { color: theme.colors.text }]}>
            Horizontal
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.layoutOption,
            isVerticalLayout && { borderColor: theme.colors.primary, borderWidth: 2 }
          ]}
          onPress={() => setIsVerticalLayout(true)}
        >
          <View style={styles.layoutPreview}>
            <View style={styles.verticalLayoutPreview}>
              <View style={[styles.layoutColorBarVertical, { backgroundColor: primaryColor }]} />
              <View style={styles.layoutContent} />
            </View>
          </View>
          <Text style={[styles.layoutLabel, { color: theme.colors.text }]}>
            Vertical
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 24 }]}>
        Advanced Options
      </Text>
      
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
          Add Logo/Photo
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary + '20' }]}
          onPress={() => {
            // This would be implemented when photo upload is ready
            alert('Photo upload will be available in a future update');
          }}
        >
          <Ionicons name="add" size={20} color={theme.colors.primary} />
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingRow}>
        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
          Show Social Icons
        </Text>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
        />
      </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.error }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Customize Card
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
      
      <View style={[styles.tabs, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'colors' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('colors')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'colors' ? { color: theme.colors.primary } : { color: theme.colors.textSecondary }
          ]}>
            Colors
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'fonts' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('fonts')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'fonts' ? { color: theme.colors.primary } : { color: theme.colors.textSecondary }
          ]}>
            Fonts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'layout' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('layout')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'layout' ? { color: theme.colors.primary } : { color: theme.colors.textSecondary }
          ]}>
            Layout
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'colors' && renderColorsTab()}
        {activeTab === 'fonts' && renderFontsTab()}
        {activeTab === 'layout' && renderLayoutTab()}
      </ScrollView>
      
      <View style={[styles.previewContainer, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.previewTitle, { color: theme.colors.text }]}>
          Preview
        </Text>
        
        <View style={[styles.cardPreview, { backgroundColor }]}>
          <View style={[
            isVerticalLayout ? styles.verticalGradient : styles.horizontalGradient,
            { backgroundColor: primaryColor }
          ]} />
          
          <View style={styles.previewContent}>
            <View style={[styles.previewAvatar, { backgroundColor: primaryColor }]}>
              <Text style={styles.previewAvatarText}>AB</Text>
            </View>
            
            <View style={styles.previewInfo}>
              <View style={[styles.previewTextLine, { backgroundColor: textColor + '80', width: '70%' }]} />
              <View style={[styles.previewTextLine, { backgroundColor: textColor + '60', width: '50%' }]} />
              <View style={[styles.previewTextLine, { backgroundColor: textColor + '40', width: '80%' }]} />
            </View>
          </View>
        </View>
      </View>
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
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContent: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 16,
  },
  layoutOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  layoutOption: {
    width: '48%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    alignItems: 'center',
  },
  layoutPreview: {
    width: '100%',
    aspectRatio: 1.6,
    marginBottom: 8,
  },
  horizontalLayoutPreview: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  verticalLayoutPreview: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  layoutColorBar: {
    width: '30%',
    height: '100%',
  },
  layoutColorBarVertical: {
    width: '100%',
    height: '100%',
  },
  layoutContent: {
    flex: 1,
  },
  layoutLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLabel: {
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  previewContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardPreview: {
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  horizontalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
  },
  verticalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  previewContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  previewAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  previewTextLine: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});

export default CardCustomizationScreen;