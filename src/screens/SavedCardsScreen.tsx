import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BusinessCard } from './HomeScreen';
import { getSavedBusinessCards, deleteBusinessCard } from '../utils/storageUtils';

const SavedCardsScreen = () => {
  const navigation = useNavigation();
  const [savedCards, setSavedCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved cards when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadSavedCards = async () => {
        setLoading(true);
        const cards = await getSavedBusinessCards();
        setSavedCards(cards);
        setLoading(false);
      };
      
      loadSavedCards();
      
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // Handle viewing a card
  const handleViewCard = (card: BusinessCard) => {
    navigation.navigate('ContactPreview' as never, { businessCard: card } as never);
  };

  // Handle editing a card
  const handleEditCard = (card: BusinessCard) => {
    navigation.navigate('NFCWriter' as never, { 
      editMode: true, 
      businessCard: card 
    } as never);
  };

  // Handle deleting a card
  const handleDeleteCard = (index: number, name: string) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteBusinessCard(index);
            if (success) {
              // Update the list after deletion
              const updatedCards = await getSavedBusinessCards();
              setSavedCards(updatedCards);
            } else {
              Alert.alert('Error', 'Failed to delete the contact');
            }
          }
        }
      ]
    );
  };

  // Render each card item
  const renderCard = ({ item, index }: { item: BusinessCard; index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.name}</Text>
        
        {item.title && (
          <Text style={styles.cardDetail}>{item.title}</Text>
        )}
        
        {item.company && (
          <Text style={styles.cardDetail}>{item.company}</Text>
        )}
        
        {item.phone && (
          <View style={styles.cardRow}>
            <Ionicons name="call-outline" size={16} color="#555" />
            <Text style={styles.cardRowText}>{item.phone}</Text>
          </View>
        )}
        
        {item.email && (
          <View style={styles.cardRow}>
            <Ionicons name="mail-outline" size={16} color="#555" />
            <Text style={styles.cardRowText}>{item.email}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => handleViewCard(item)}
        >
          <Ionicons name="eye-outline" size={22} color="#0066cc" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => handleEditCard(item)}
        >
          <Ionicons name="create-outline" size={22} color="#0066cc" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => handleDeleteCard(index, item.name)}
        >
          <Ionicons name="trash-outline" size={22} color="#cc0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading saved cards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Business Cards</Text>
      
      {savedCards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="card-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No saved cards yet</Text>
          <Text style={styles.emptySubtext}>
            Cards you save will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedCards}
          renderItem={renderCard}
          keyExtractor={(_, index) => `card-${index}`}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardRowText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  cardActions: {
    justifyContent: 'space-around',
  },
  cardButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SavedCardsScreen; 