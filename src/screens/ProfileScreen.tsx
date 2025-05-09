import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backupToCloud, restoreFromCloud, getLastBackupTimestamp } from '../utils/backupUtils';

const ProfileScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [savedCardsCount, setSavedCardsCount] = useState(0);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [showAccessibilityInfo, setShowAccessibilityInfo] = useState(false);
  
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
  }, []);
  
  const handleBackup = async () => {
    Alert.alert(
      'Backup Data',
      'Do you want to backup your data to the cloud?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Backup',
          onPress: async () => {
            const success = await backupToCloud();
            if (success) {
              const timestamp = await getLastBackupTimestamp();
              setLastBackup(timestamp);
              Alert.alert('Success', 'Your data has been backed up successfully.');
            } else {
              Alert.alert('Error', 'Failed to backup your data. Please try again later.');
            }
          }
        }
      ]
    );
  };
  
  const handleRestore = async () => {
    Alert.alert(
      'Restore Data',
      'Do you want to restore your data from the cloud? This will replace your current data.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Restore',
          onPress: async () => {
            const success = await restoreFromCloud();
            if (success) {
              Alert.alert('Success', 'Your data has been restored successfully.');
              // Reload saved cards count
              const savedCardsJson = await AsyncStorage.getItem('savedBusinessCards');
              const savedCards = savedCardsJson ? JSON.parse(savedCardsJson) : [];
              setSavedCardsCount(savedCards.length);
            } else {
              Alert.alert('Error', 'Failed to restore your data. Please try again later.');
            }
          }
        }
      ]
    );
  };
  
  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(parseInt(timestamp)).toLocaleString();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.profileSection, { backgroundColor: theme.colors.card }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>SparX User</Text>
              <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>user@example.com</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="moon-outline" size={24} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Dark Mode</Text>
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
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="card-outline" size={24} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Saved Cards</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{savedCardsCount}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="time-outline" size={24} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Last Backup</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{formatDate(lastBackup)}</Text>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleBackup}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Backup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleRestore}
            >
              <Ionicons name="cloud-download-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Restore</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Version</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>1.0.0</Text>
          </View>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="document-text-outline" size={24} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
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
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0066cc',
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
    padding: 20,
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
    borderBottomColor: '#eee',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;