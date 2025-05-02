import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Animated, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient'; // Use expo-linear-gradient for Expo
import switchTheme from 'react-native-theme-switch-animation'; // Add theme switch animation

export type BusinessCard = {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  notes: string;
  additionalPhones?: string[];
  additionalEmails?: string[];
  additionalWebsites?: string[];
};

const AVATAR_URL = 'https://ui-avatars.com/api/?name=Sparx+Business+Card&background=7F00FF&color=fff&size=128';

// --- THEME & DESIGN SYSTEM ---
const themePalette = {
  light: {
    background: '#EEEEEE',
    card: '#fff',
    primary: '#3B1E54',
    secondary: '#9B7EBD',
    accent: '#D4BEE4',
    text: '#3B1E54',
    subtext: '#9B7EBD',
    border: '#D4BEE4',
    shadow: '#9B7EBD',
    button: '#3B1E54',
    buttonText: '#fff',
    pressed: '#D4BEE4',
  },
  dark: {
    background: '#3B1E54',
    card: '#232026',
    primary: '#EEEEEE',
    secondary: '#D4BEE4',
    accent: '#9B7EBD',
    text: '#EEEEEE',
    subtext: '#D4BEE4',
    border: '#9B7EBD',
    shadow: '#232026',
    button: '#9B7EBD',
    buttonText: '#232026',
    pressed: '#6a4c93',
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
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

  const palette = themePalette[theme];

  return (
    <LinearGradient
      colors={theme === 'light' ? [palette.background, palette.accent] : [palette.background, palette.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { backgroundColor: palette.background }]}
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
            backgroundColor: palette.card,
            shadowColor: palette.shadow,
            borderColor: palette.border,
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
                    backgroundColor: pressed ? palette.pressed : palette.button,
                    borderColor: palette.border,
                  }
                ]}
                onPressIn={animateIn}
                onPressOut={animateOut}
                onPress={btn.onPress}
                accessibilityRole="button"
                accessibilityLabel={btn.label}
              >
                <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
                  <Ionicons name={btn.icon as any} size={24} color={palette.buttonText} style={{ marginRight: 12 }} />
                  <Text style={[styles.elegantButtonText, { color: palette.buttonText }]}>{btn.label}</Text>
                </Animated.View>
              </Pressable>
            ))}
            {/* Theme Switch Button */}
            <Pressable
              style={({ pressed }) => [
                styles.elegantButton,
                {
                  backgroundColor: pressed ? palette.pressed : palette.button,
                  borderColor: palette.border,
                }
              ]}
              onPress={() => {
                switchTheme({
                  switchThemeFunction: () => {
                    setTheme(theme === 'light' ? 'dark' : 'light');
                  },
                  animationConfig: {
                    type: 'fade',
                    duration: 900,
                  },
                });
              }}
              accessibilityRole="button"
              accessibilityLabel="Switch Theme"
            >
              <Animated.View style={{ flexDirection: 'row', alignItems: 'center', transform: [{ scale: scaleAnim }] }}>
                <Ionicons name={theme === 'light' ? 'moon' : 'sunny'} size={24} color={palette.buttonText} style={{ marginRight: 12 }} />
                <Text style={[styles.elegantButtonText, { color: palette.buttonText }]}>Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme</Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
        <Text style={[styles.footer, { color: palette.subtext }]} accessibilityRole="text">© {new Date().getFullYear()} Sparx Solutions</Text>
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
    backgroundColor: '#18181b',
  },
  eliteCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(245, 50, 50, 0.18)',
    borderRadius: 36,
    padding: 36,
    alignItems: 'center',
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 16,
    marginBottom: 24,
    borderWidth: 0, // Remove border
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#E100FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  eliteBadgeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  eliteBadge: {
    backgroundColor: 'rgba(44,83,100,0.18)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 16,
    letterSpacing: 2,
    borderWidth: 1,
    borderColor: 'rgb(255, 255, 255)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  company: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    opacity: 0.85,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    opacity: 0.95,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.85,
  },
  accentLine: {
    width: 80,
    height: 4,
    backgroundColor: '#38ef7d', // green accent
    borderRadius: 2,
    marginBottom: 32,
    opacity: 0.45,
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 350,
  },
  elegantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(35,37,38,0.85)', // deep charcoal
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 18,
    marginTop: 2,
    shadowColor: '#11998e', // teal shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(56,239,125,0.18)', // green border
    opacity: 0.98,
    minHeight: 54,
  },
  elegantButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: '#11998e',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(127,0,255,0.18)',
  },
  footer: {
    color: '#fff',
    opacity: 0.5,
    fontSize: 13,
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    letterSpacing: 1,
  },
});

export default HomeScreen;