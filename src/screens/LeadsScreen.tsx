import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessCard } from '../types/businessCard';
import { getSavedBusinessCards } from '../utils/storageUtils';

const LeadsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [leads, setLeads] = useState<BusinessCard[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeads();
    
    // Refresh leads when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadLeads();
    });
    
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLeads(leads);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = leads.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        (lead.company && lead.company.toLowerCase().includes(query)) ||
        (lead.title && lead.title.toLowerCase().includes(query)) ||
        (lead.email && lead.email.toLowerCase().includes(query)) ||
        (lead.phone && lead.phone.includes(query))
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      // In a real app, you would have a separate leads collection
      // For now, we'll use saved cards as leads
      const savedCards = await getSavedBusinessCards();
      setLeads(savedCards);
      setFilteredLeads(savedCards);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadLeads();
  };

  const renderLead = ({ item }: { item: BusinessCard }) => (
    <TouchableOpacity
      style={[styles.leadCard, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate('CardView' as never, { cardData: item } as never)}
      accessibilityLabel={`View ${item.name}'s contact details`}
      accessibilityRole="button"
    >
      <View style={styles.leadInfo}>
        <View style={[
          styles.avatarContainer,
          { backgroundColor: theme.colors.primary }
        ]}>
          <Text style={styles.avatarText}>
            {item.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.leadDetails}>
          <Text style={[styles.leadName, { color: theme.colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          
          {item.title ? (
            <Text style={[styles.leadTitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {item.title}
              {item.company ? ` at ${item.company}` : ''}
            </Text>
          ) : item.company ? (
            <Text style={[styles.leadTitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {item.company}
            </Text>
          ) : null}
          
          <View style={styles.contactRow}>
            {item.phone && (
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={14} color={theme.colors.primary} style={styles.contactIcon} />
                <Text style={[styles.contactText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                  {item.phone}
                </Text>
              </View>
            )}
            
            {item.email && (
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={14} color={theme.colors.primary} style={styles.contactIcon} />
                <Text style={[styles.contactText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                  {item.email}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.leadActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => {}}
          accessibilityLabel={`Call ${item.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => {}}
          accessibilityLabel={`Email ${item.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => {}}
          accessibilityLabel={`Add note for ${item.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="people-outline" 
        size={64} 
        color={theme.colors.textSecondary} 
        style={styles.emptyIcon} 
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Leads Found
      </Text>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {searchQuery ? 'Try a different search term' : 'Scan business cards to add leads'}
      </Text>
      
      {!searchQuery && (
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Scan' as never)}
          accessibilityLabel="Scan a business card"
          accessibilityRole="button"
        >
          <Ionicons name="scan-outline" size={20} color="#fff" style={styles.scanButtonIcon} />
          <Text style={styles.scanButtonText}>Scan Business Card</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Leads
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
        {filteredLeads.length} {filteredLeads.length === 1 ? 'contact' : 'contacts'}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading leads...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search leads..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <FlatList
        data={filteredLeads}
        renderItem={renderLead}
        keyExtractor={(item) => item.id || item.name}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('Scan' as never)}
        accessibilityLabel="Scan business card"
        accessibilityRole="button"
      >
        <Ionicons name="scan-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  leadCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leadInfo: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leadDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  leadName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  leadTitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  contactIcon: {
    marginRight: 4,
  },
  contactText: {
    fontSize: 12,
  },
  leadActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  scanButtonIcon: {
    marginRight: 8,
  },
  scanButtonText: {
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

export default LeadsScreen;