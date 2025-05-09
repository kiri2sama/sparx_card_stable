import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessCard } from '../types/businessCard';
import { getSavedBusinessCards, deleteBusinessCard } from '../utils/storageUtils';
import CardPreview from '../components/CardPreview';

const SavedCardsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCards();
    
    // Refresh cards when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadCards();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const savedCards = await getSavedBusinessCards();
      // Sort by most recently updated
      const sortedCards = [...savedCards].sort((a, b) => 
        (b.updatedAt || 0) - (a.updatedAt || 0)
      );
      setCards(sortedCards);
    } catch (error) {
      console.error('Error loading saved cards:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCards();
  };

  const handleDeleteCard = (card: BusinessCard) => {
    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete ${card.name}'s card?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (card.id) {
              await deleteBusinessCard(card.id);
              loadCards();
            }
          }
        }
      ]
    );
  };

  const renderCard = ({ item }: { item: BusinessCard }) => (
    <View style={[styles.cardContainer, { backgroundColor: theme.colors.card }]}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={() => navigation.navigate('CardView' as never, { cardData: item } as never)}
        accessibilityLabel={`View ${item.name}'s business card`}
        accessibilityRole="button"
      >
        <CardPreview card={item} />
      </TouchableOpacity>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.cardAction, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => navigation.navigate('CardView' as never, { cardData: item } as never)}
          accessibilityLabel={`View ${item.name}'s card details`}
          accessibilityRole="button"
        >
          <Ionicons name="eye-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.cardActionText, { color: theme.colors.primary }]}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.cardAction, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => navigation.navigate('NFCWriter' as never, { 
            editMode: true, 
            businessCard: item 
          } as never)}
          accessibilityLabel={`Edit ${item.name}'s card`}
          accessibilityRole="button"
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.cardActionText, { color: theme.colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.cardAction, { backgroundColor: theme.colors.error + '10' }]}
          onPress={() => handleDeleteCard(item)}
          accessibilityLabel={`Delete ${item.name}'s card`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.cardActionText, { color: theme.colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="card-outline" 
        size={64} 
        color={theme.colors.textSecondary} 
        style={styles.emptyIcon} 
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Saved Cards
      </Text>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        Your saved business cards will appear here
      </Text>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('NFCWriter' as never)}
        accessibilityLabel="Create a new business card"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={20} color="#fff" style={styles.createButtonIcon} />
        <Text style={styles.createButtonText}>Create New Card</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading cards...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id || item.name}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('NFCWriter' as never)}
        accessibilityLabel="Create new card"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  cardContainer: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTouchable: {
    width: '100%',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  cardAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cardActionText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  createButtonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default SavedCardsScreen;