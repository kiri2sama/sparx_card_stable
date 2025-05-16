import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useDatabase } from '../database/context';
import { DatabaseProvider } from '../database/types';

const DatabaseConfigScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { db, config, isLoading, error, switchProvider } = useDatabase();

  // State for form fields
  const [selectedProvider, setSelectedProvider] = useState<DatabaseProvider>(
    config.provider
  );
  
  // PostgreSQL config
  const [pgHost, setPgHost] = useState(config.postgres?.host || '');
  const [pgPort, setPgPort] = useState(
    config.postgres?.port ? config.postgres.port.toString() : '5432'
  );
  const [pgDatabase, setPgDatabase] = useState(config.postgres?.database || '');
  const [pgUser, setPgUser] = useState(config.postgres?.user || '');
  const [pgPassword, setPgPassword] = useState(config.postgres?.password || '');
  const [pgSsl, setPgSsl] = useState(config.postgres?.ssl || false);
  
  // Firebase config
  const [fbApiKey, setFbApiKey] = useState(config.firebase?.apiKey || '');
  const [fbAuthDomain, setFbAuthDomain] = useState(config.firebase?.authDomain || '');
  const [fbProjectId, setFbProjectId] = useState(config.firebase?.projectId || '');
  const [fbStorageBucket, setFbStorageBucket] = useState(config.firebase?.storageBucket || '');
  const [fbMessagingSenderId, setFbMessagingSenderId] = useState(
    config.firebase?.messagingSenderId || ''
  );
  const [fbAppId, setFbAppId] = useState(config.firebase?.appId || '');
  
  // Supabase config
  const [sbUrl, setSbUrl] = useState(config.supabase?.url || '');
  const [sbKey, setSbKey] = useState(config.supabase?.key || '');
  
  // Local config
  const [localEncrypt, setLocalEncrypt] = useState(config.local?.encryptData || false);
  const [localEncryptionKey, setLocalEncryptionKey] = useState(
    config.local?.encryptionKey || ''
  );

  /**
   * Handle saving the database configuration
   */
  const handleSaveConfig = async () => {
    try {
      let newConfig = {
        provider: selectedProvider
      };

      // Add provider-specific configuration
      switch (selectedProvider) {
        case DatabaseProvider.POSTGRES:
          if (!pgHost || !pgDatabase || !pgUser) {
            Alert.alert('Error', 'Please fill in all required PostgreSQL fields');
            return;
          }
          
          newConfig = {
            ...newConfig,
            postgres: {
              host: pgHost,
              port: parseInt(pgPort, 10),
              database: pgDatabase,
              user: pgUser,
              password: pgPassword,
              ssl: pgSsl
            }
          };
          break;
        
        case DatabaseProvider.FIREBASE:
          if (!fbApiKey || !fbProjectId || !fbAppId) {
            Alert.alert('Error', 'Please fill in all required Firebase fields');
            return;
          }
          
          newConfig = {
            ...newConfig,
            firebase: {
              apiKey: fbApiKey,
              authDomain: fbAuthDomain,
              projectId: fbProjectId,
              storageBucket: fbStorageBucket,
              messagingSenderId: fbMessagingSenderId,
              appId: fbAppId
            }
          };
          break;
        
        case DatabaseProvider.SUPABASE:
          if (!sbUrl || !sbKey) {
            Alert.alert('Error', 'Please fill in all required Supabase fields');
            return;
          }
          
          newConfig = {
            ...newConfig,
            supabase: {
              url: sbUrl,
              key: sbKey
            }
          };
          break;
        
        case DatabaseProvider.LOCAL:
          newConfig = {
            ...newConfig,
            local: {
              encryptData: localEncrypt,
              encryptionKey: localEncrypt ? localEncryptionKey : undefined
            }
          };
          
          if (localEncrypt && !localEncryptionKey) {
            Alert.alert('Error', 'Please provide an encryption key for local storage');
            return;
          }
          break;
      }

      // Confirm with the user
      Alert.alert(
        'Confirm Database Change',
        `Are you sure you want to switch to ${selectedProvider}? This will require restarting the app.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Switch', 
            onPress: async () => {
              // Switch to the new provider
              await switchProvider(newConfig);
              
              // Show success message
              Alert.alert(
                'Success',
                `Successfully switched to ${selectedProvider}`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            }
          }
        ]
      );
    } catch (err) {
      console.error('Error saving database configuration:', err);
      Alert.alert('Error', `Failed to save configuration: ${err}`);
    }
  };

  /**
   * Render the PostgreSQL configuration form
   */
  const renderPostgresConfig = () => (
    <View style={styles.providerConfig}>
      <Text style={[styles.providerTitle, { color: theme.colors.text }]}>
        PostgreSQL Configuration
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Host *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={pgHost}
          onChangeText={setPgHost}
          placeholder="localhost or IP address"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Port</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={pgPort}
          onChangeText={setPgPort}
          placeholder="5432"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Database Name *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={pgDatabase}
          onChangeText={setPgDatabase}
          placeholder="sparx_cards"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Username *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={pgUser}
          onChangeText={setPgUser}
          placeholder="postgres"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={pgPassword}
          onChangeText={setPgPassword}
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Use SSL</Text>
        <Switch
          value={pgSsl}
          onValueChange={setPgSsl}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor={pgSsl ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  /**
   * Render the Firebase configuration form
   */
  const renderFirebaseConfig = () => (
    <View style={styles.providerConfig}>
      <Text style={[styles.providerTitle, { color: theme.colors.text }]}>
        Firebase Configuration
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>API Key *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={fbApiKey}
          onChangeText={setFbApiKey}
          placeholder="Your Firebase API Key"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Auth Domain</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={fbAuthDomain}
          onChangeText={setFbAuthDomain}
          placeholder="your-app.firebaseapp.com"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Project ID *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={fbProjectId}
          onChangeText={setFbProjectId}
          placeholder="your-project-id"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Storage Bucket</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={fbStorageBucket}
          onChangeText={setFbStorageBucket}
          placeholder="your-app.appspot.com"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Messaging Sender ID</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={fbMessagingSenderId}
          onChangeText={setFbMessagingSenderId}
          placeholder="123456789012"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>App ID *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={fbAppId}
          onChangeText={setFbAppId}
          placeholder="1:123456789012:web:abcdef1234567890"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
    </View>
  );

  /**
   * Render the Supabase configuration form
   */
  const renderSupabaseConfig = () => (
    <View style={styles.providerConfig}>
      <Text style={[styles.providerTitle, { color: theme.colors.text }]}>
        Supabase Configuration
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Supabase URL *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={sbUrl}
          onChangeText={setSbUrl}
          placeholder="https://your-project.supabase.co"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Supabase Key *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.colors.border, color: theme.colors.text }
          ]}
          value={sbKey}
          onChangeText={setSbKey}
          placeholder="Your Supabase API Key"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
        />
      </View>
    </View>
  );

  /**
   * Render the local storage configuration form
   */
  const renderLocalConfig = () => (
    <View style={styles.providerConfig}>
      <Text style={[styles.providerTitle, { color: theme.colors.text }]}>
        Local Storage Configuration
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Encrypt Data</Text>
        <Switch
          value={localEncrypt}
          onValueChange={setLocalEncrypt}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor={localEncrypt ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
      
      {localEncrypt && (
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Encryption Key *</Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: theme.colors.border, color: theme.colors.text }
            ]}
            value={localEncryptionKey}
            onChangeText={setLocalEncryptionKey}
            placeholder="Your encryption key"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
          />
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading database configuration...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.cardBackground }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Database Configuration</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error.message}
            </Text>
          </View>
        )}
        
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            Current database provider: <Text style={{ fontWeight: 'bold' }}>{config.provider}</Text>
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Select a database provider and configure its settings.
          </Text>
        </View>
        
        <View style={styles.providerSelector}>
          {Object.values(DatabaseProvider).map(provider => (
            <TouchableOpacity
              key={provider}
              style={[
                styles.providerOption,
                selectedProvider === provider && [
                  styles.selectedProvider,
                  { borderColor: theme.colors.primary }
                ]
              ]}
              onPress={() => setSelectedProvider(provider)}
            >
              <Text
                style={[
                  styles.providerText,
                  {
                    color:
                      selectedProvider === provider
                        ? theme.colors.primary
                        : theme.colors.text
                  }
                ]}
              >
                {provider}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedProvider === DatabaseProvider.POSTGRES && renderPostgresConfig()}
        {selectedProvider === DatabaseProvider.FIREBASE && renderFirebaseConfig()}
        {selectedProvider === DatabaseProvider.SUPABASE && renderSupabaseConfig()}
        {selectedProvider === DatabaseProvider.LOCAL && renderLocalConfig()}
        
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSaveConfig}
        >
          <Text style={styles.saveButtonText}>Save Configuration</Text>
        </TouchableOpacity>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  providerSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  providerOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedProvider: {
    borderWidth: 2,
  },
  providerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  providerConfig: {
    marginBottom: 24,
  },
  providerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DatabaseConfigScreen;