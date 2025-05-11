import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { BusinessCard } from '../types/businessCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

interface NetworkingEvent {
  id: string;
  name: string;
  date: number;
  location: string;
  description: string;
  contacts: string[]; // Array of contact IDs
  notes: string;
}

const NetworkingEventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  
  const [events, setEvents] = useState<NetworkingEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<NetworkingEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventContacts, setEventContacts] = useState<BusinessCard[]>([]);
  const [allContacts, setAllContacts] = useState<BusinessCard[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    loadEvents();
    loadContacts();
  }, []);
  
  const loadEvents = async () => {
    try {
      const eventsJson = await AsyncStorage.getItem('networkingEvents');
      if (eventsJson) {
        const loadedEvents = JSON.parse(eventsJson);
        setEvents(loadedEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };
  
  const loadContacts = async () => {
    try {
      const contactsJson = await AsyncStorage.getItem('savedBusinessCards');
      if (contactsJson) {
        const contacts = JSON.parse(contactsJson);
        setAllContacts(contacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };
  
  const saveEvents = async (updatedEvents: NetworkingEvent[]) => {
    try {
      await AsyncStorage.setItem('networkingEvents', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };
  
  const handleCreateEvent = () => {
    setIsEditMode(false);
    setEventName('');
    setEventDate(new Date());
    setEventLocation('');
    setEventDescription('');
    setEventContacts([]);
    setShowEventModal(true);
  };
  
  const handleEditEvent = (event: NetworkingEvent) => {
    setIsEditMode(true);
    setSelectedEvent(event);
    setEventName(event.name);
    setEventDate(new Date(event.date));
    setEventLocation(event.location);
    setEventDescription(event.description);
    
    // Load contacts for this event
    const eventContactsList = allContacts.filter(contact => 
      event.contacts.includes(contact.id || '')
    );
    setEventContacts(eventContactsList);
    
    setShowEventModal(true);
  };
  
  const handleSaveEvent = () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Event name is required');
      return;
    }
    
    const eventData: NetworkingEvent = {
      id: isEditMode && selectedEvent ? selectedEvent.id : `event_${Date.now()}`,
      name: eventName.trim(),
      date: eventDate.getTime(),
      location: eventLocation.trim(),
      description: eventDescription.trim(),
      contacts: eventContacts.map(contact => contact.id || '').filter(Boolean),
      notes: '',
    };
    
    let updatedEvents: NetworkingEvent[];
    
    if (isEditMode && selectedEvent) {
      // Update existing event
      updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? eventData : event
      );
    } else {
      // Create new event
      updatedEvents = [...events, eventData];
    }
    
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setShowEventModal(false);
  };
  
  const handleDeleteEvent = (event: NetworkingEvent) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedEvents = events.filter(e => e.id !== event.id);
            setEvents(updatedEvents);
            saveEvents(updatedEvents);
          }
        }
      ]
    );
  };
  
  const handleAddContact = () => {
    // In a real app, this would open a contact picker
    // For now, we'll just show a list of all contacts
    Alert.alert(
      'Add Contact',
      'This feature will be available in a future update.',
      [{ text: 'OK' }]
    );
  };
  
  const handleRemoveContact = (contact: BusinessCard) => {
    setEventContacts(eventContacts.filter(c => c.id !== contact.id));
  };
  
  const renderEventItem = ({ item }: { item: NetworkingEvent }) => {
    const eventDate = new Date(item.date);
    const formattedDate = format(eventDate, 'MMM d, yyyy');
    const contactCount = item.contacts.length;
    
    return (
      <TouchableOpacity
        style={[styles.eventCard, { backgroundColor: theme.colors.card }]}
        onPress={() => handleEditEvent(item)}
        accessibilityLabel={`View event ${item.name}`}
        accessibilityRole="button"
      >
        <View style={styles.eventHeader}>
          <Text style={[styles.eventName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteEvent(item)}
            accessibilityLabel={`Delete event ${item.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} style={styles.eventIcon} />
            <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
              {formattedDate}
            </Text>
          </View>
          
          {item.location && (
            <View style={styles.eventDetail}>
              <Ionicons name="location-outline" size={16} color={theme.colors.primary} style={styles.eventIcon} />
              <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
                {item.location}
              </Text>
            </View>
          )}
          
          <View style={styles.eventDetail}>
            <Ionicons name="people-outline" size={16} color={theme.colors.primary} style={styles.eventIcon} />
            <Text style={[styles.eventDetailText, { color: theme.colors.textSecondary }]}>
              {contactCount} {contactCount === 1 ? 'contact' : 'contacts'}
            </Text>
          </View>
        </View>
        
        {item.description && (
          <Text 
            style={[styles.eventDescription, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderEventModal = () => (
    <Modal
      visible={showEventModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEventModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowEventModal(false)}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {isEditMode ? 'Edit Event' : 'New Event'}
            </Text>
            
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleSaveEvent}
              accessibilityLabel="Save event"
              accessibilityRole="button"
            >
              <Text style={[styles.modalSaveText, { color: theme.colors.primary }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Event Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
                value={eventName}
                onChangeText={setEventName}
                placeholder="Enter event name"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Date
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => {
                  // In a real app, this would open a date picker
                  Alert.alert(
                    'Date Picker',
                    'This feature will be available in a future update.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Text style={[styles.dateText, { color: theme.colors.text }]}>
                  {format(eventDate, 'MMMM d, yyyy')}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Location
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
                value={eventLocation}
                onChangeText={setEventLocation}
                placeholder="Enter location"
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    color: theme.colors.text,
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border
                  }
                ]}
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="Enter event description"
                placeholderTextColor={theme.colors.placeholder}
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.contactsHeader}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Contacts
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleAddContact}
                  accessibilityLabel="Add contact"
                  accessibilityRole="button"
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {eventContacts.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No contacts added yet
                </Text>
              ) : (
                <View style={styles.contactsList}>
                  {eventContacts.map((contact) => (
                    <View 
                      key={contact.id} 
                      style={[
                        styles.contactItem,
                        { 
                          backgroundColor: theme.colors.background,
                          borderColor: theme.colors.border
                        }
                      ]}
                    >
                      <Text style={[styles.contactName, { color: theme.colors.text }]}>
                        {contact.name}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveContact(contact)}
                        accessibilityLabel={`Remove ${contact.name}`}
                        accessibilityRole="button"
                      >
                        <Ionicons name="close-circle" size={20} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Networking Events
        </Text>
      </View>
      
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventsList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="calendar-outline" 
              size={64} 
              color={theme.colors.textSecondary} 
              style={styles.emptyIcon} 
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Events Yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Create your first networking event to start tracking contacts
            </Text>
          </View>
        )}
      />
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreateEvent}
        accessibilityLabel="Create new event"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      
      {renderEventModal()}
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
  },
  eventsList: {
    padding: 20,
    paddingBottom: 100,
  },
  eventCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventIcon: {
    marginRight: 8,
  },
  eventDetailText: {
    fontSize: 14,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
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
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSaveButton: {
    padding: 4,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalScrollView: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  dateInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  contactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactsList: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactName: {
    fontSize: 16,
  },
  removeButton: {
    padding: 4,
  },
});

export default NetworkingEventScreen;