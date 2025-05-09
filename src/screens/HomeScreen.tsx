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
      
      // Set the first card as "my card" if it exists
      if (sortedCards.length > 0) {
        setMyCard(sortedCards[0]);
      }
      
      // Set recent cards (excluding the first one)
      setRecentCards(sortedCards.slice(0, 5));
    } catch (error) {
      console.error('Error loading saved cards:', error);
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
          ? [theme.colors.background, theme.colors.backgroundDark] 
          : [theme.colors.background, theme.colors.primaryLight + '20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            SparX Card
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
              onPress: () => navigation.navigate('Cards' as never)
            }].map((btn, idx) => (
              <Pressable
                key={btn.label}
                style={({ pressed }) => [
                  styles.quickActionButton,
                  {
                    backgroundColor: pressed 
                      ? theme.colors.primaryLight + '30'
                      : theme.colors.background,
                    borderColor: theme.colors.border,
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
                  transform: [{ scale: scaleAnim }] 
                }}>
                  <View style={[
                    styles.quickActionIconContainer,
                    { backgroundColor: theme.colors.primary + '20' }
                  ]}>
                    <Ionicons 
                      name={btn.icon as any} 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text style={[
                    styles.quickActionText, 
                    { color: theme.colors.text }
                  ]}>
                    {btn.label}
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
    fontSize: 24,
    fontWeight: 'bold',
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '500',
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
    padding: 8,
  },
  quickActionButton: {
    width: '50%',
    padding: 8,
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  recentCardsContainer: {
    padding: 16,
  },
  recentCardItem: {
    marginRight: 16,
    width: 200,
  },
});

export default HomeScreen;