import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';

const ScanOptionsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollViewContent}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Read</Text>
      
      <TouchableOpacity 
        style={[styles.optionCard, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate('NFCReader' as never)}
        accessibilityLabel="Scan NFC Card"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name="radio-outline" 
            size={60} 
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
            size={60} 
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
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>Write</Text>
      
      <TouchableOpacity 
        style={[styles.optionCard, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate('NFCWriter' as never)}
        accessibilityLabel="Write NFC Card"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name="create-outline" 
            size={60} 
            color={theme.colors.primary} 
          />
        </View>
        <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
          Write Business Card
        </Text>
        <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
          Write your business card to an NFC tag
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.optionCard, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate('AdvancedNFCWriter' as never)}
        accessibilityLabel="Advanced NFC Writer"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name="construct-outline" 
            size={60} 
            color={theme.colors.primary} 
          />
        </View>
        <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
          Advanced NFC Writer
        </Text>
        <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
          Write text, URLs, WiFi credentials, and more to NFC tags
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 8,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
    padding: 12,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default ScanOptionsScreen;