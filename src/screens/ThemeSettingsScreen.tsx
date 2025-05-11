import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const ThemeSettingsScreen = () => {
  const { theme, isDarkMode, toggleTheme, setThemeMode } = useTheme();
  const { t } = useTranslation();

  const themeOptions = [
    {
      name: 'Light',
      value: 'light',
      icon: 'sunny-outline',
      description: 'Light background with dark text'
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: 'moon-outline',
      description: 'Dark background with light text'
    },
    {
      name: 'System',
      value: 'system',
      icon: 'settings-outline',
      description: 'Follow system theme settings'
    }
  ];

  const currentTheme = isDarkMode ? 'dark' : 'light';

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Appearance
          </Text>
        </View>

        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.themeOption,
              currentTheme === option.value && { 
                backgroundColor: theme.colors.primaryLight + '20' // 20% opacity
              }
            ]}
            onPress={() => setThemeMode(option.value as any)}
            accessibilityLabel={`${option.name} theme`}
            accessibilityRole="radio"
            accessibilityState={{ checked: currentTheme === option.value }}
          >
            <View style={styles.themeOptionContent}>
              <View style={[
                styles.themeIconContainer, 
                { backgroundColor: theme.colors.primary + '20' }
              ]}>
                <Ionicons 
                  name={option.icon as any} 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </View>
              <View style={styles.themeTextContainer}>
                <Text style={[styles.themeOptionTitle, { color: theme.colors.text }]}>
                  {option.name}
                </Text>
                <Text style={[styles.themeOptionDescription, { color: theme.colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
            </View>
            {currentTheme === option.value && (
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={theme.colors.primary} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
              Toggle between light and dark mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Color Preview
          </Text>
        </View>

        <View style={styles.colorPreviewContainer}>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.colorLabel}>Primary</Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary }]}>
              <Text style={styles.colorLabel}>Secondary</Text>
            </View>
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.colorLabel, { color: theme.colors.text }]}>Background</Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.colorLabel, { color: theme.colors.text }]}>Card</Text>
            </View>
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.text }]}>
              <Text style={[styles.colorLabel, { color: theme.colors.card }]}>Text</Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.border }]}>
              <Text style={styles.colorLabel}>Border</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  themeTextContainer: {
    flex: 1,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  themeOptionDescription: {
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  colorPreviewContainer: {
    padding: 16,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  colorSwatch: {
    width: '48%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  colorLabel: {
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ThemeSettingsScreen;