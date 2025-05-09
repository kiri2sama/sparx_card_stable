import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const settingsOptions = [
    {
      title: 'Theme',
      icon: 'color-palette-outline',
      onPress: () => navigation.navigate('ThemeSettings' as never),
      accessibilityLabel: 'Theme settings'
    },
    {
      title: 'Language',
      icon: 'language-outline',
      onPress: () => navigation.navigate('LanguageSettings' as never),
      accessibilityLabel: 'Language settings'
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => {},
      accessibilityLabel: 'Notification settings'
    },
    {
      title: 'Privacy',
      icon: 'shield-outline',
      onPress: () => {},
      accessibilityLabel: 'Privacy settings'
    },
    {
      title: 'Backup & Restore',
      icon: 'cloud-outline',
      onPress: () => navigation.navigate('BackupRestore' as never),
      accessibilityLabel: 'Backup and restore settings'
    },
    {
      title: 'Accessibility',
      icon: 'accessibility-outline',
      onPress: () => {},
      accessibilityLabel: 'Accessibility settings'
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => {},
      accessibilityLabel: 'Help and support'
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => {},
      accessibilityLabel: 'About this app'
    }
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={option.title}
            style={[
              styles.settingRow,
              index < settingsOptions.length - 1 && 
                { borderBottomWidth: 1, borderBottomColor: theme.colors.border }
            ]}
            onPress={option.onPress}
            accessibilityLabel={option.accessibilityLabel}
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons 
                name={option.icon as any} 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                {option.title}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
  },
});

export default SettingsScreen;