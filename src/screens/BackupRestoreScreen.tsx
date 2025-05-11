import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { backupToCloud, restoreFromCloud, getLastBackupTimestamp } from '../utils/backupUtils';

const BackupRestoreScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [operation, setOperation] = useState<'backup' | 'restore' | null>(null);

  useEffect(() => {
    loadLastBackupTimestamp();
  }, []);

  const loadLastBackupTimestamp = async () => {
    const timestamp = await getLastBackupTimestamp();
    setLastBackup(timestamp);
  };

  const handleBackup = async () => {
    setIsLoading(true);
    setOperation('backup');
    
    try {
      const success = await backupToCloud();
      
      if (success) {
        await loadLastBackupTimestamp();
        Alert.alert(
          'Success',
          'Your data has been backed up successfully.'
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to backup your data. Please try again later.'
        );
      }
    } catch (error) {
      console.error('Backup error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred during backup.'
      );
    } finally {
      setIsLoading(false);
      setOperation(null);
    }
  };

  const handleRestore = async () => {
    Alert.alert(
      'Restore Data',
      'This will replace your current data with the backup. Are you sure you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setOperation('restore');
            
            try {
              const success = await restoreFromCloud();
              
              if (success) {
                Alert.alert(
                  'Success',
                  'Your data has been restored successfully.'
                );
              } else {
                Alert.alert(
                  'Error',
                  'Failed to restore your data. Please try again later.'
                );
              }
            } catch (error) {
              console.error('Restore error:', error);
              Alert.alert(
                'Error',
                'An unexpected error occurred during restore.'
              );
            } finally {
              setIsLoading(false);
              setOperation(null);
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
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Cloud Backup
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabelContainer}>
            <Ionicons 
              name="time-outline" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.infoIcon} 
            />
            <View>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
                Last Backup
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
                {formatDate(lastBackup)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary },
              isLoading && operation === 'backup' && { opacity: 0.7 }
            ]}
            onPress={handleBackup}
            disabled={isLoading}
            accessibilityLabel="Backup data to cloud"
            accessibilityRole="button"
          >
            {isLoading && operation === 'backup' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons 
                  name="cloud-upload-outline" 
                  size={20} 
                  color="#fff" 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.buttonText}>Backup Now</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.error },
              isLoading && operation === 'restore' && { opacity: 0.7 }
            ]}
            onPress={handleRestore}
            disabled={isLoading || !lastBackup}
            accessibilityLabel="Restore data from cloud"
            accessibilityRole="button"
          >
            {isLoading && operation === 'restore' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons 
                  name="cloud-download-outline" 
                  size={20} 
                  color="#fff" 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.buttonText}>Restore Data</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoSection, { backgroundColor: theme.colors.card }]}>
        <Ionicons 
          name="information-circle-outline" 
          size={24} 
          color={theme.colors.primary} 
          style={styles.infoSectionIcon}
        />
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Backup saves all your business cards, contacts, and app settings to the cloud. You can restore this data on any device by signing in with the same account.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Local Backup
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.optionRow, { borderBottomColor: theme.colors.border }]}
          accessibilityLabel="Export data"
          accessibilityRole="button"
        >
          <View style={styles.optionLabelContainer}>
            <Ionicons 
              name="download-outline" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.optionIcon} 
            />
            <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
              Export Data
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={theme.colors.textSecondary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          accessibilityLabel="Import data"
          accessibilityRole="button"
        >
          <View style={styles.optionLabelContainer}>
            <Ionicons 
              name="upload-outline" 
              size={24} 
              color={theme.colors.primary} 
              style={styles.optionIcon} 
            />
            <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
              Import Data
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
  infoRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
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
  infoSection: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSectionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  optionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
  },
});

export default BackupRestoreScreen;