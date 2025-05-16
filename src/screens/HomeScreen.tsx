import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Animated,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessCard } from '../types/businessCard';
import { getSavedBusinessCards } from '../utils/storageUtils';
import CardPreview from '../components/CardPreview';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [recentCards, setRecentCards] = useState<BusinessCard[]>([]);
  const [myCard, setMyCard] = useState<BusinessCard | null>(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    loadRecentCards();
  }, [navigation]);

  const loadRecentCards = async () => {
    try {
      const savedCards = await getSavedBusinessCards();
      
      // Sort by most recently updated
      const sortedCards = [...savedCards].sort((a, b) => 
        (b.updatedAt || 0) - (a.updatedAt || 0)
      );
      
      // Find a card that might be the user's own card (based on usage or creation date)
      // For now, we'll use the most recently updated card as "my card"
      if (sortedCards.length > 0) {
        setMyCard(sortedCards[0]);
        
        // Set recent cards (excluding the first one)
        setRecentCards(sortedCards.slice(1, 6));
      } else {
        setRecentCards([]);
      }
      
      // Add a listener to refresh when the screen comes into focus
      const unsubscribe = navigation.addListener('focus', () => {
        loadRecentCards();
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error loading saved cards:', error);
      setRecentCards([]);
    }
  };

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={isDarkMode 
          ? [theme.colors.primary, theme.colors.backgroundDark] 
          : [theme.colors.primary, theme.colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            SparX Card
          </Text>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF' }]}>
            Your Digital Business Card Solution
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* My Digital Card Preview */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              My Digital Card
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('NFCWriter' as never)}
              accessibilityLabel="Edit my digital card"
              accessibilityRole="button"
            >
              <Text style={[styles.sectionAction, { color: theme.colors.primary }]}>
                {myCard ? 'Edit' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>

          {myCard ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('CardView' as never, { cardData: myCard } as never)}
              accessibilityLabel="View my digital card"
              accessibilityRole="button"
            >
              <CardPreview card={myCard} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.emptyCardContainer, { borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('NFCWriter' as never)}
              accessibilityLabel="Create your digital business card"
              accessibilityRole="button"
            >
              <Ionicons 
                name="add-circle-outline" 
                size={48} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.emptyCardText, { color: theme.colors.textSecondary }]}>
                Create your digital business card
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Quick Actions
            </Text>
          </View>

          <View style={styles.quickActionsGrid}>
            {[{
              icon: 'create-outline',
              label: 'Create New Card',
              onPress: () => navigation.navigate('NFCWriter' as never),
              color: '#4CAF50', // Green
              description: 'Create a new digital business card'
            }, {
              icon: 'construct-outline',
              label: 'Advanced NFC Writer',
              onPress: () => navigation.navigate('AdvancedNFCWriter' as never),
              color: '#E91E63', // Pink
              description: 'Write text, URLs, WiFi credentials & more'
            }, {
              icon: 'scan-outline',
              label: 'Scan NFC Card',
              onPress: () => navigation.navigate('NFCReader' as never),
              color: '#2196F3', // Blue
              description: 'Read a business card from an NFC tag'
            }, {
              icon: 'person-add-outline',
              label: 'Import Contact',
              onPress: handleImportContact,
              color: '#9C27B0', // Purple
              description: 'Import from your phone contacts'
            }, {
              icon: 'bookmark-outline',
              label: 'Saved Cards',
              onPress: () => navigation.navigate('Cards' as never),
              color: '#FF9800', // Orange
              description: 'View your saved business cards'
            }].map((btn, idx) => (
              <Pressable
                key={btn.label}
                style={({ pressed }) => [
                  styles.quickActionButton,
                  {
                    backgroundColor: pressed 
                      ? theme.colors.primaryLight + '30'
                      : theme.colors.card,
                    borderColor: theme.colors.border,
                    borderLeftColor: btn.color,
                    borderLeftWidth: 4,
                  }
                ]}
                onPressIn={animateIn}
                onPressOut={animateOut}
                onPress={btn.onPress}
                accessibilityRole="button"
                accessibilityLabel={btn.label}
              >
                <Animated.View style={{ 
                  alignItems: 'center', 
                  transform: [{ scale: scaleAnim }],
                  width: '100%'
                }}>
                  <View style={[
                    styles.quickActionIconContainer,
                    { backgroundColor: btn.color + '20' }
                  ]}>
                    <Ionicons 
                      name={btn.icon as any} 
                      size={24} 
                      color={btn.color} 
                    />
                  </View>
                  <Text style={[
                    styles.quickActionText, 
                    { color: theme.colors.text, fontWeight: 'bold' }
                  ]}>
                    {btn.label}
                  </Text>
                  <Text style={[
                    styles.quickActionDescription, 
                    { color: theme.colors.textSecondary }
                  ]}>
                    {btn.description}
                  </Text>
                </Animated.View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        {recentCards.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recent Activity
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Cards' as never)}
                accessibilityLabel="View all cards"
                accessibilityRole="button"
              >
                <Text style={[styles.sectionAction, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentCardsContainer}
            >
              {recentCards.map((card, index) => (
                <TouchableOpacity
                  key={card.id || index}
                  style={styles.recentCardItem}
                  onPress={() => navigation.navigate('CardView' as never, { cardData: card } as never)}
                  accessibilityLabel={`View ${card.name}'s business card`}
                  accessibilityRole="button"
                >
                  <CardPreview card={card} small />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  section: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCardContainer: {
    height: 180,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCardText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  quickActionButton: {
    width: '50%',
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  recentCardsContainer: {
    padding: 16,
  },
  recentCardItem: {
    marginRight: 16,
    width: 220,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default HomeScreen;