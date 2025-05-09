import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../i18n';

const LanguageSettingsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    // Add more languages as they become available
  ];

  const currentLanguage = i18n.language;

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Select Language
          </Text>
        </View>

        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageOption,
              currentLanguage === language.code && { 
                backgroundColor: theme.colors.primaryLight + '20' // 20% opacity
              }
            ]}
            onPress={() => changeLanguage(language.code)}
            accessibilityLabel={`${language.name} language`}
            accessibilityRole="radio"
            accessibilityState={{ checked: currentLanguage === language.code }}
          >
            <View style={styles.languageOptionContent}>
              <Text style={styles.languageFlag}>{language.flag}</Text>
              <Text style={[styles.languageName, { color: theme.colors.text }]}>
                {language.name}
              </Text>
            </View>
            {currentLanguage === language.code && (
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={theme.colors.primary} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.infoSection, { backgroundColor: theme.colors.card }]}>
        <Ionicons 
          name="information-circle-outline" 
          size={24} 
          color={theme.colors.primary} 
          style={styles.infoIcon}
        />
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Changing the language will translate the app interface. Some content like your saved business cards will remain in their original language.
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
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
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

export default LanguageSettingsScreen;