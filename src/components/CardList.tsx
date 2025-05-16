import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../styles/ThemeProvider';
import { useDatabaseService } from '../database/service';
import { BusinessCard } from '../types/businessCard';

type CardListProps = {
  userId?: string;
  teamId?: string;
  onCardPress?: (card: BusinessCard) => void;
};

const CardList: React.FC<CardListProps> = ({ userId, teamId, onCardPress }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { getCards, getUserCards, getTeamCards, isLoading, error } = useDatabaseService();
  
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        
        let loadedCards: BusinessCard[];
        
        if (userId) {
          // Load cards for a specific user
          loadedCards = await getUserCards(userId);
        } else if (teamId) {
          // Load cards for a specific team
          loadedCards = await getTeamCards(teamId);
        } else {
          // Load all cards
          loadedCards = await getCards();
        }
        
        setCards(loadedCards);
      } catch (err) {
        console.error('Failed to load cards:', err);
        setLoadError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    if (!isLoading) {
      loadCards();
    }
  }, [isLoading, userId, teamId, getCards, getUserCards, getTeamCards]);

  const handleCardPress = (card: BusinessCard) => {
    if (onCardPress) {
      onCardPress(card);
    } else {
      navigation.navigate('CardView' as never, { cardData: card } as never);
    }
  };

  if (isLoading || loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading cards...
        </Text>
      </View>
    );
  }

  if (error || loadError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
          Error Loading Cards
        </Text>
        <Text style={[styles.errorMessage, { color: theme.colors.text }]}>
          {(error || loadError)?.message}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setLoading(true)} // This will trigger the useEffect again
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="card-outline" size={48} color={theme.colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No Cards Found
        </Text>
        <Text style={[styles.emptyMessage, { color: theme.colors.textSecondary }]}>
          {userId
            ? "This user doesn't have any cards yet."
            : teamId
            ? "This team doesn't have any cards yet."
            : "You don't have any cards yet."}
        </Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('NFCWriter' as never)}
        >
          <Text style={styles.createButtonText}>Create New Card</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.cardItem, { backgroundColor: theme.colors.cardBackground }]}
          onPress={() => handleCardPress(item)}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.cardName, { color: theme.colors.text }]}>{item.name}</Text>
            <Text style={[styles.cardTitle, { color: theme.colors.textSecondary }]}>
              {item.title}
              {item.company ? ` at ${item.company}` : ''}
            </Text>
            <View style={styles.cardDetails}>
              {item.phone && (
                <View style={styles.cardDetail}>
                  <Ionicons name="call-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.cardDetailText, { color: theme.colors.text }]}>
                    {item.phone}
                  </Text>
                </View>
              )}
              {item.email && (
                <View style={styles.cardDetail}>
                  <Ionicons name="mail-outline" size={16} color={theme.colors.primary} />
                  <Text style={[styles.cardDetailText, { color: theme.colors.text }]}>
                    {item.email}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardDetails: {
    marginTop: 4,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardDetailText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default CardList;