import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessCard } from '../types/businessCard';
import { getSavedBusinessCards } from '../utils/storageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for contact management
interface ContactCategory {
  id: string;
  name: string;
  color: string;
}

interface ContactWithCategory extends BusinessCard {
  categoryId?: string;
  notes?: string;
  followUpDate?: number;
}

const ContactManagementScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const [contacts, setContacts] = useState<ContactWithCategory[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactWithCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ContactCategory[]>([
    { id: 'all', name: 'All Contacts', color: theme.colors.primary },
    { id: 'clients', name: 'Clients', color: '#4CAF50' },
    { id: 'prospects', name: 'Prospects', color: '#FF9800' },
    { id: 'partners', name: 'Partners', color: '#2196F3' },
    { id: 'vendors', name: 'Vendors', color: '#9C27B0' },
    { id: 'other', name: 'Other', color: '#607D8B' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactWithCategory | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState<Date>(new Date());
  const [followUpNote, setFollowUpNote] = useState('');
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  useEffect(() => {
    filterContacts();
  }, [searchQuery, selectedCategory, contacts]);
  
  const loadContacts = async () => {
    try {
      // Load saved cards
      const savedCards = await getSavedBusinessCards();
      
      // Load contact categories and follow-ups
      const contactCategoriesJson = await AsyncStorage.getItem('contactCategories');
      const contactCategories = contactCategoriesJson ? JSON.parse(contactCategoriesJson) : {};
      
      const followUpsJson = await AsyncStorage.getItem('contactFollowUps');
      const followUps = followUpsJson ? JSON.parse(followUpsJson) : {};
      
      // Combine data
      const contactsWithCategories = savedCards.map(card => ({
        ...card,
        categoryId: contactCategories[card.id || ''] || 'other',
        followUpDate: followUps[card.id || '']?.date,
        notes: followUps[card.id || '']?.notes,
      }));
      
      setContacts(contactsWithCategories);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };
  
  const filterContacts = () => {
    let filtered = [...contacts];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(contact => contact.categoryId === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(query) ||
        (contact.company && contact.company.toLowerCase().includes(query)) ||
        (contact.title && contact.title.toLowerCase().includes(query)) ||
        (contact.email && contact.email.toLowerCase().includes(query)) ||
        (contact.phone && contact.phone.includes(query))
      );
    }
    
    setFilteredContacts(filtered);
  };
  
  const handleCategoryChange = async (contact: ContactWithCategory, categoryId: string) => {
    try {
      // Update local state
      const updatedContacts = contacts.map(c => 
        c.id === contact.id ? { ...c, categoryId } : c
      );
      setContacts(updatedContacts);
      
      // Save to storage
      const contactCategoriesJson = await AsyncStorage.getItem('contactCategories');
      const contactCategories = contactCategoriesJson ? JSON.parse(contactCategoriesJson) : {};
      
      contactCategories[contact.id || ''] = categoryId;
      await AsyncStorage.setItem('contactCategories', JSON.stringify(contactCategories));
      
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  
  const handleSetFollowUp = async () => {
    if (!selectedContact || !selectedContact.id) return;
    
    try {
      // Update local state
      const updatedContacts = contacts.map(c => 
        c.id === selectedContact.id 
          ? { ...c, followUpDate: followUpDate.getTime(), notes: followUpNote } 
          : c
      );
      setContacts(updatedContacts);
      
      // Save to storage
      const followUpsJson = await AsyncStorage.getItem('contactFollowUps');
      const followUps = followUpsJson ? JSON.parse(followUpsJson) : {};
      
      followUps[selectedContact.id] = {
        date: followUpDate.getTime(),
        notes: followUpNote,
      };
      
      await AsyncStorage.setItem('contactFollowUps', JSON.stringify(followUps));
      
      setShowFollowUpModal(false);
      Alert.alert('Success', 'Follow-up reminder set');
    } catch (error) {
      console.error('Error setting follow-up:', error);
    }
  };
  
  const renderCategoryBadge = (categoryId?: string) => {
    const category = categories.find(c => c.id === categoryId) || categories[5]; // Default to "Other"
    
    return (
      <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
        <Text style={[styles.categoryText, { color: category.color }]}>
          {category.name}
        </Text>
      </View>
    );
  };
  
  const renderFollowUpBadge = (followUpDate?: number) => {
    if (!followUpDate) return null;
    
    const date = new Date(followUpDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isOverdue = date < today;
    const isToday = date.toDateString() === today.toDateString();
    
    let badgeColor = theme.colors.primary;
    let badgeText = date.toLocaleDateString();
    
    if (isOverdue) {
      badgeColor = theme.colors.error;
      badgeText = `Overdue: ${badgeText}`;
    } else if (isToday) {
      badgeColor = theme.colors.warning;
      badgeText = 'Today';
    }
    
    return (
      <View style={[styles.followUpBadge, { backgroundColor: badgeColor + '20' }]}>
        <Ionicons name="alarm-outline" size={14} color={badgeColor} style={styles.followUpIcon} />
        <Text style={[styles.followUpText, { color: badgeColor }]}>
          {badgeText}
        </Text>
      </View>
    );
  };
  
  const renderContactItem = ({ item }: { item: ContactWithCategory }) => (
    <TouchableOpacity
      style={[styles.contactCard, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate('CardView' as never, { cardData: item } as never)}
      accessibilityLabel={`View ${item.name}'s contact details`}
      accessibilityRole="button"
    >
      <View style={styles.contactHeader}>
        <View style={[
          styles.avatarContainer,
          { backgroundColor: theme.colors.primary }
        ]}>
          <Text style={styles.avatarText}>
            {item.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          
          {item.title || item.company ? (
            <Text style={[styles.contactDetails, { color: theme.colors.textSecondary }]}>
              {item.title}{item.title && item.company ? ' at ' : ''}{item.company}
            </Text>
          ) : null}
        </View>
        
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setSelectedContact(item);
            setShowCategoryModal(true);
          }}
          accessibilityLabel="More options"
          accessibilityRole="button"
        >
          <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contactFooter}>
        {renderCategoryBadge(item.categoryId)}
        {renderFollowUpBadge(item.followUpDate)}
      </View>
      
      {item.notes && (
        <View style={[styles.notesContainer, { backgroundColor: theme.colors.backgroundDark + '50' }]}>
          <Text style={[styles.notesText, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {item.notes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
  const renderCategorySelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categorySelectorContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && { 
              backgroundColor: category.color,
              borderColor: category.color
            }
          ]}
          onPress={() => setSelectedCategory(category.id)}
          accessibilityLabel={category.name}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedCategory === category.id }}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category.id 
              ? { color: '#fff' } 
              : { color: category.color }
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
  const renderCategoryModal = () => (
    <Modal
      visible={showCategoryModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Manage Contact
          </Text>
          
          <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
            {selectedContact?.name}
          </Text>
          
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: theme.colors.text }]}>
              Categorize Contact
            </Text>
            
            <View style={styles.categoryGrid}>
              {categories.filter(c => c.id !== 'all').map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryGridItem,
                    { borderColor: category.color },
                    selectedContact?.categoryId === category.id && { backgroundColor: category.color + '20' }
                  ]}
                  onPress={() => selectedContact && handleCategoryChange(selectedContact, category.id)}
                >
                  <Text style={[styles.categoryGridText, { color: category.color }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: theme.colors.text }]}>
              Actions
            </Text>
            
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
                onPress={() => {
                  setShowCategoryModal(false);
                  if (selectedContact) {
                    setFollowUpDate(new Date());
                    setFollowUpNote(selectedContact.notes || '');
                    setShowFollowUpModal(true);
                  }
                }}
              >
                <Ionicons name="alarm-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
                  Set Follow-up
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
                onPress={() => {
                  setShowCategoryModal(false);
                  if (selectedContact) {
                    navigation.navigate('CardView' as never, { cardData: selectedContact } as never);
                  }
                }}
              >
                <Ionicons name="eye-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.colors.backgroundDark }]}
            onPress={() => setShowCategoryModal(false)}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  const renderFollowUpModal = () => (
    <Modal
      visible={showFollowUpModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFollowUpModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Set Follow-up Reminder
          </Text>
          
          <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
            {selectedContact?.name}
          </Text>
          
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: theme.colors.text }]}>
              Follow-up Date
            </Text>
            
            <View style={styles.datePickerContainer}>
              {/* In a real app, you would use a proper date picker here */}
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: theme.colors.backgroundDark }]}
                onPress={() => {
                  const newDate = new Date();
                  newDate.setDate(newDate.getDate() + 1);
                  setFollowUpDate(newDate);
                }}
              >
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                  Tomorrow
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: theme.colors.backgroundDark }]}
                onPress={() => {
                  const newDate = new Date();
                  newDate.setDate(newDate.getDate() + 7);
                  setFollowUpDate(newDate);
                }}
              >
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                  Next Week
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: theme.colors.backgroundDark }]}
                onPress={() => {
                  const newDate = new Date();
                  newDate.setMonth(newDate.getMonth() + 1);
                  setFollowUpDate(newDate);
                }}
              >
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                  Next Month
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.selectedDate, { color: theme.colors.primary }]}>
              {followUpDate.toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: theme.colors.text }]}>
              Notes
            </Text>
            
            <TextInput
              style={[
                styles.notesInput,
                { 
                  color: theme.colors.text,
                  backgroundColor: theme.colors.backgroundDark,
                  borderColor: theme.colors.border
                }
              ]}
              value={followUpNote}
              onChangeText={setFollowUpNote}
              placeholder="Add notes about this follow-up..."
              placeholderTextColor={theme.colors.placeholder}
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.backgroundDark }]}
              onPress={() => setShowFollowUpModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSetFollowUp}
            >
              <Text style={styles.modalButtonText}>
                Set Reminder
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Contact Management
        </Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search contacts..."
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
      
      {renderCategorySelector()}
      
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id || item.name}
        contentContainerStyle={styles.contactsList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="people-outline" 
              size={64} 
              color={theme.colors.textSecondary} 
              style={styles.emptyIcon} 
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Contacts Found
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try a different search or category' 
                : 'Add contacts to start managing your network'}
            </Text>
          </View>
        )}
      />
      
      {renderCategoryModal()}
      {renderFollowUpModal()}
    </View>
  );
};

// ScrollView component for horizontal scrolling categories
const ScrollView = ({ children, ...props }: any) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      {...props}
      data={[{ key: 'content' }]}
      renderItem={() => <View>{children}</View>}
    />
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
  categorySelectorContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactsList: {
    padding: 20,
    paddingBottom: 100,
  },
  contactCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactHeader: {
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
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactDetails: {
    fontSize: 14,
  },
  moreButton: {
    padding: 8,
  },
  contactFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  followUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  followUpIcon: {
    marginRight: 4,
  },
  followUpText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  notesText: {
    fontSize: 14,
    fontStyle: 'italic',
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryGridItem: {
    width: '33.33%',
    padding: 4,
  },
  categoryGridText: {
    textAlign: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },
  dateButtonText: {
    fontSize: 14,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notesInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ContactManagementScreen;