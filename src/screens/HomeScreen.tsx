import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Animated, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessCard } from '../types/businessCard';

const AVATAR_URL = 'https://ui-avatars.com/api/?name=Sparx+Business+Card&background=7F00FF&color=fff&size=128';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleImportContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant contacts permission to import contacts.'
      );
      return;
    }

    try {
      const contact = await Contacts.presentContactPickerAsync();
      
      if (!contact) {
        return;
      }
      
      const businessCard: BusinessCard = {
        name: contact.name || '',
        title: contact.jobTitle || '',
        company: contact.company || '',
        phone: contact.phoneNumbers && contact.phoneNumbers.length > 0 
          ? contact.phoneNumbers[0].number 
          : '',
        email: contact.emails && contact.emails.length > 0 
          ? contact.emails[0].email 
          : '',
        website: contact.urlAddresses && contact.urlAddresses.length > 0 
          ? contact.urlAddresses[0].url 
          : '',
        notes: contact.note || '',
        additionalPhones: contact.phoneNumbers && contact.phoneNumbers.length > 1
          ? contact.phoneNumbers.slice(1).map(p => p.number)
          : [],
        additionalEmails: contact.emails && contact.emails.length > 1
          ? contact.emails.slice(1).map(e => e.email)
          : [],
        additionalWebsites: contact.urlAddresses && contact.urlAddresses.length > 1
          ? contact.urlAddresses.slice(1).map(u => u.url)
          : []
      };

      navigation.navigate('NFCWriter' as never, { 
        editMode: true, 
        businessCard
      } as never);
    } catch (error) {
      console.error('Error importing contact:', error);
      Alert.alert('Error', 'Failed to import contact');
    }
  };

  // Animation for button press
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const animateIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const animateOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <LinearGradient
      colors={isDarkMode 
        ? [theme.colors.background, theme.colors.backgroundDark] 
        : [theme.colors.background, theme.colors.primaryLight]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Animated.ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.eliteCard,
          {
            backgroundColor: theme.colors.card,
            shadowColor: theme.colors.primary,
            borderColor: theme.colors.border,
          }
        ]}>
          <View style={styles.buttonGroup}>
            {[{
              icon: 'create-outline',
              label: 'Create New Card',
              onPress: () => navigation.navigate('NFCWriter' as never)
            }, {
              icon: 'scan-outline',
              label: 'Scan NFC Card',
              onPress: () => navigation.navigate('NFCReader' as never)
            }, {
              icon: 'person-add-outline',
              label: 'Import Contact',
              onPress: handleImportContact
            }, {
              icon: 'bookmark-outline',
              label: 'Saved Cards',
              onPress: () => navigation.navigate('SavedCards' as never)
            }].map((btn, idx) => (
              <Pressable
                key={btn.label}
                style={({ pressed }) => [
                  styles.elegantButton,
                  {
                    backgroundColor: pressed 
                      ? theme.colors.primaryDark 
                      : theme.colors.primary,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPressIn={animateIn}
                onPressOut={animateOut}
                onPress={btn.onPress}
                accessibilityRole="button"
                accessibilityLabel={btn.label}
              >
                <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
                  <Ionicons name={btn.icon as any} size={24} color="#fff" style={{ marginRight: 12 }} />
                  <Text style={styles.elegantButtonText}>{btn.label}</Text>
                </Animated.View>
              </Pressable>
            ))}
            {/* Theme Switch Button */}
            <Pressable
              style={({ pressed }) => [
                styles.elegantButton,
                {
                  backgroundColor: pressed 
                    ? theme.colors.primaryDark 
                    : theme.colors.primary,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => {
                toggleTheme();
              }}
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Theme`}
            >
              <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
                <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color="#fff" style={{ marginRight: 12 }} />
                <Text style={styles.elegantButtonText}>
                  Switch to {isDarkMode ? 'Light' : 'Dark'} Theme
                </Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
        <Text style={[styles.footer, { color: theme.colors.textSecondary }]} accessibilityRole="text">
          © {new Date().getFullYear()} Sparx Solutions
        </Text>
      </Animated.ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  eliteCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 36,
    padding: 36,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 16,
    marginBottom: 24,
    borderWidth: 0,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 350,
  },
  elegantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 18,
    marginTop: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 0,
    minHeight: 54,
  },
  elegantButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    opacity: 0.5,
    fontSize: 13,
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    letterSpacing: 1,
  },
});

export default HomeScreen;