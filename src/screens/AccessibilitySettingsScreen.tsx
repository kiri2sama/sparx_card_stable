import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Slider
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  textSize: number;
  buttonSize: 'normal' | 'large' | 'xlarge';
  hapticFeedback: boolean;
}

const AccessibilitySettingsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    textSize: 1,
    buttonSize: 'normal',
    hapticFeedback: true,
  });
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  };
  
  const saveSettings = async (updatedSettings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem('accessibilitySettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };
  
  const handleToggleSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };
  
  const handleTextSizeChange = (value: number) => {
    const updatedSettings = { ...settings, textSize: value };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };
  
  const handleButtonSizeChange = (size: 'normal' | 'large' | 'xlarge') => {
    const updatedSettings = { ...settings, buttonSize: size };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };
  
  const getTextSizeLabel = () => {
    if (settings.textSize <= 0.8) return 'Small';
    if (settings.textSize <= 1.0) return 'Normal';
    if (settings.textSize <= 1.2) return 'Large';
    if (settings.textSize <= 1.4) return 'X-Large';
    return 'XX-Large';
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
          Accessibility
        </Text>
        
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Display
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                High Contrast
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Increases contrast for better readability
              </Text>
            </View>
            <Switch
              value={settings.highContrast}
              onValueChange={(value) => handleToggleSetting('highContrast', value)}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Large Text
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Increases text size throughout the app
              </Text>
            </View>
            <Switch
              value={settings.largeText}
              onValueChange={(value) => handleToggleSetting('largeText', value)}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: theme.colors.text }]}>
              Text Size: {getTextSizeLabel()}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.8}
              maximumValue={1.6}
              step={0.1}
              value={settings.textSize}
              onValueChange={handleTextSizeChange}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderMinLabel, { color: theme.colors.textSecondary }]}>A</Text>
              <Text style={[styles.sliderMaxLabel, { color: theme.colors.textSecondary }]}>A</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Interaction
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Reduce Motion
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Reduces animations and motion effects
              </Text>
            </View>
            <Switch
              value={settings.reduceMotion}
              onValueChange={(value) => handleToggleSetting('reduceMotion', value)}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Screen Reader Support
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Optimizes app for screen readers
              </Text>
            </View>
            <Switch
              value={settings.screenReader}
              onValueChange={(value) => handleToggleSetting('screenReader', value)}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Haptic Feedback
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Vibration feedback for interactions
              </Text>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={(value) => handleToggleSetting('hapticFeedback', value)}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Touch Target Size
          </Text>
          
          <Text style={[styles.settingDescription, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            Adjust the size of buttons and interactive elements
          </Text>
          
          <View style={styles.buttonSizeOptions}>
            <TouchableOpacity
              style={[
                styles.buttonSizeOption,
                settings.buttonSize === 'normal' && { 
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.primary + '20'
                }
              ]}
              onPress={() => handleButtonSizeChange('normal')}
              accessibilityLabel="Normal button size"
              accessibilityRole="radio"
              accessibilityState={{ checked: settings.buttonSize === 'normal' }}
            >
              <View style={styles.buttonSizePreview}>
                <View style={styles.normalButtonPreview} />
              </View>
              <Text style={[
                styles.buttonSizeLabel, 
                { color: settings.buttonSize === 'normal' ? theme.colors.primary : theme.colors.text }
              ]}>
                Normal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.buttonSizeOption,
                settings.buttonSize === 'large' && { 
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.primary + '20'
                }
              ]}
              onPress={() => handleButtonSizeChange('large')}
              accessibilityLabel="Large button size"
              accessibilityRole="radio"
              accessibilityState={{ checked: settings.buttonSize === 'large' }}
            >
              <View style={styles.buttonSizePreview}>
                <View style={styles.largeButtonPreview} />
              </View>
              <Text style={[
                styles.buttonSizeLabel, 
                { color: settings.buttonSize === 'large' ? theme.colors.primary : theme.colors.text }
              ]}>
                Large
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.buttonSizeOption,
                settings.buttonSize === 'xlarge' && { 
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.primary + '20'
                }
              ]}
              onPress={() => handleButtonSizeChange('xlarge')}
              accessibilityLabel="Extra large button size"
              accessibilityRole="radio"
              accessibilityState={{ checked: settings.buttonSize === 'xlarge' }}
            >
              <View style={styles.buttonSizePreview}>
                <View style={styles.xlargeButtonPreview} />
              </View>
              <Text style={[
                styles.buttonSizeLabel, 
                { color: settings.buttonSize === 'xlarge' ? theme.colors.primary : theme.colors.text }
              ]}>
                X-Large
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.infoSection, { backgroundColor: theme.colors.card }]}>
          <Ionicons 
            name="information-circle-outline" 
            size={24} 
            color={theme.colors.primary} 
            style={styles.infoIcon}
          />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            These settings help make the app more accessible. For additional accessibility features, please use your device's built-in accessibility settings.
          </Text>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLabelContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  sliderContainer: {
    paddingVertical: 16,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderMinLabel: {
    fontSize: 14,
  },
  sliderMaxLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonSizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSizeOption: {
    width: '30%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonSizePreview: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  normalButtonPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  largeButtonPreview: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  xlargeButtonPreview: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  buttonSizeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AccessibilitySettingsScreen;