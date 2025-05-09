import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLastBackupTimestamp } from '../utils/backupUtils';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [savedCardsCount, setSavedCardsCount] = useState(0);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  
  useEffect(() => {
    // Load saved cards count
    const loadSavedCardsCount = async () => {
      try {
        const savedCardsJson = await AsyncStorage.getItem('savedBusinessCards');
        const savedCards = savedCardsJson ? JSON.parse(savedCardsJson) : [];
        setSavedCardsCount(savedCards.length);
      } catch (error) {
        console.error('Error loading saved cards count:', error);
      }
    };
    
    // Load last backup timestamp
    const loadLastBackup = async () => {
      const timestamp = await getLastBackupTimestamp();
      setLastBackup(timestamp);
    };
    
    loadSavedCardsCount();
    loadLastBackup();
    
    // Refresh when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedCardsCount();
      loadLastBackup();
    });
    
    return unsubscribe;
  }, [navigation]);
  
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(parseInt(timestamp)).toLocaleString();
  };
  
  const getCurrentLanguageName = () => {
    switch (i18n.language) {
      case 'en': return 'English';
      case 'es': return 'Español';
      default: return 'English';
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileSection, { backgroundColor: theme.colors.card }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>
                SparX User
              </Text>
              <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                user@example.com
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            App Settings
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('Settings' as never)}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons 
                name="settings-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Settings
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLabelContainer}>
              <Ionicons 
                name="moon-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Dark Mode
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
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('LanguageSettings' as never)}
            accessibilityLabel="Language"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons 
                name="language-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Language
              </Text>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                {getCurrentLanguageName()}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => {}}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Notifications
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Data
          </Text>
          
          <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.infoLabelContainer}>
              <Ionicons 
                name="card-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Saved Cards
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
              {savedCardsCount}
            </Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.infoLabelContainer}>
              <Ionicons 
                name="time-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Last Backup
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
              {formatDate(lastBackup)}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => navigation.navigate('BackupRestore' as never)}
            accessibilityLabel="Backup & Restore"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons 
                name="cloud-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Backup & Restore
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About
          </Text>
          
          <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.infoLabelContainer}>
              <Ionicons 
                name="information-circle-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Version
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
              1.0.0
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
            onPress={() => {}}
            accessibilityLabel="Privacy Policy"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons 
                name="shield-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => {}}
            accessibilityLabel="Help & Support"
            accessibilityRole="button"
          >
            <View style={styles.settingLabelContainer}>
              <Ionicons 
                name="help-circle-outline" 
                size={24} 
                color={theme.colors.primary} 
                style={styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  profileSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
  },
});

export default ProfileScreen;