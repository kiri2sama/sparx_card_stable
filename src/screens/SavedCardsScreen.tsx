import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BusinessCard } from './HomeScreen';
import { getSavedBusinessCards, deleteBusinessCard } from '../utils/storageUtils';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  SavedCards: undefined;
  CardView: { cardData: BusinessCard };
};

type SavedCardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SavedCards'>;

const SavedCardsScreen = () => {
  const navigation = useNavigation() as SavedCardsScreenNavigationProp;
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<BusinessCard[]>([]);

  // Load cards whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadCards = async () => {
        setIsLoading(true);
        const savedCards = await getSavedBusinessCards();
        setCards(savedCards);
        setIsLoading(false);
      };
      
      loadCards();
    }, [])
  );

  const handleCardPress = (card: BusinessCard) => {
    navigation.navigate('CardView', { cardData: card });
  };

  const handleDeleteCard = async (index: number) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this business card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteBusinessCard(index);
            if (success) {
              // Update the local state
              const updatedCards = [...cards];
              updatedCards.splice(index, 1);
              setCards(updatedCards);
            } else {
              Alert.alert('Error', 'Failed to delete the business card');
            }
          }
        }
      ]
    );
  };

  const renderCard = ({ item, index }: { item: BusinessCard; index: number }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleCardPress(item)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.name}</Text>
        {item.company ? <Text style={styles.cardCompany}>{item.company}</Text> : null}
        {item.title ? <Text style={styles.cardTitle}>{item.title}</Text> : null}
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteCard(index)}
      >
        <Ionicons name="trash-outline" size={24} color="#cc0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Business Cards</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
      ) : cards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="card-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>No saved business cards</Text>
          <Text style={styles.emptySubtext}>
            Business cards you read or create will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(_, index) => `card-${index}`}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardCompany: {
    fontSize: 16,
    color: '#0066cc',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  loader: {
    marginTop: 30,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default SavedCardsScreen; 