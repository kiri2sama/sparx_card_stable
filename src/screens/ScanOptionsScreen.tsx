import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';

const ScanOptionsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity 
        style={[styles.optionCard, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate('NFCReader' as never)}
        accessibilityLabel="Scan NFC Card"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name="radio-outline" 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>
        <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
          Scan NFC Card
        </Text>
        <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
          Tap your phone to an NFC business card
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.optionCard, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate('QRReader' as never)}
        accessibilityLabel="Scan QR Code"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name="qr-code-outline" 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>
        <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
          Scan QR Code
        </Text>
        <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
          Scan a QR code from another business card
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  optionCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 16,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ScanOptionsScreen;