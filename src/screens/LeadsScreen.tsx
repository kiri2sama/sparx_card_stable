import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { CardProfile } from '../components/CardPreview';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mock data for leads
const initialLeads: Lead[] = [
  {
    id: '1',
    contact: {
      id: '1',
      name: 'John Smith',
      title: 'Marketing Director',
      company: 'Acme Inc.',
      email: 'john.smith@acme.com',
      phone: '+1 (555) 123-4567',
      photoUri: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    dateAdded: new Date(2023, 5, 15),
    notes: 'Met at Tech Conference 2023',
    status: 'New',
    lastContactDate: new Date(2023, 5, 15),
    enriched: false,
  },
  {
    id: '2',
    contact: {
      id: '2',
      name: 'Sarah Johnson',
      title: 'CEO',
      company: 'Johnson Enterprises',
      email: 'sarah@johnsonent.com',
      phone: '+1 (555) 987-6543',
      photoUri: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    dateAdded: new Date(2023, 4, 28),
    notes: 'Interested in our premium plan',
    status: 'Contacted',
    lastContactDate: new Date(2023, 5, 10),
    enriched: true,
    enrichedData: {
      companySize: '50-100 employees',
      industry: 'Technology',
      linkedIn: 'linkedin.com/in/sarahjohnson',
      twitter: '@sarahjohnson',
    },
  },
  {
    id: '3',
    contact: {
      id: '3',
      name: 'Michael Wong',
      title: 'CTO',
      company: 'TechSolutions',
      email: 'michael@techsolutions.com',
      phone: '+1 (555) 456-7890',
      photoUri: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    dateAdded: new Date(2023, 5, 5),
    notes: 'Follow up about integration options',
    status: 'Qualified',
    lastContactDate: new Date(2023, 5, 12),
    enriched: false,
  },
];

// Types
type Lead = {
  id: string;
  contact: CardProfile;
  dateAdded: Date;
  notes?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed';
  lastContactDate?: Date;
  enriched: boolean;
  enrichedData?: {
    companySize?: string;
    industry?: string;
    linkedIn?: string;
    twitter?: string;
    revenue?: string;
    founded?: string;
    website?: string;
  };
};

type LeadScreenProps = {
  navigation: any;
};

const LeadsScreen: React.FC<LeadScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [isEnriching, setIsEnriching] = useState<string | null>(null);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Filter leads based on search query
  const filteredLeads = leads.filter(lead => 
    lead.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle lead selection
  const toggleLeadSelection = (leadId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedLead(prevSelected => prevSelected === leadId ? null : leadId);
  };
  
  // Mock function to enrich lead data
  const enrichLeadData = (leadId: string) => {
    setIsEnriching(leadId);
    
    // Simulate API call with delay
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      
      setLeads(prevLeads => 
        prevLeads.map(lead => {
          if (lead.id === leadId) {
            return {
              ...lead,
              enriched: true,
              enrichedData: {
                companySize: '100-250 employees',
                industry: 'Software & Technology',
                linkedIn: `linkedin.com/company/${lead.contact.company.toLowerCase().replace(/\s/g, '')}`,
                twitter: `@${lead.contact.company.toLowerCase().replace(/\s/g, '')}`,
                revenue: '$5M - $10M',
                founded: '2015',
                website: `https://www.${lead.contact.company.toLowerCase().replace(/\s/g, '')}.com`,
              }
            };
          }
          return lead;
        })
      );
      
      setIsEnriching(null);
    }, 2000);
  };
  
  // Update lead status
  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setLeads(prevLeads => 
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status: newStatus,
            lastContactDate: new Date(),
          };
        }
        return lead;
      })
    );
  };
  
  // Add a note to a lead
  const addNoteToLead = (leadId: string, note: string) => {
    if (!note.trim()) return;
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setLeads(prevLeads => 
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          return {
            ...lead,
            notes: lead.notes ? `${lead.notes}\n${note}` : note,
          };
        }
        return lead;
      })
    );
  };
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Render lead item
  const renderLeadItem = ({ item }: { item: Lead }) => {
    const isSelected = selectedLead === item.id;
    const isCurrentlyEnriching = isEnriching === item.id;
    
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={[
            styles.leadCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            }
          ]}
          onPress={() => toggleLeadSelection(item.id)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Lead: ${item.contact.name} from ${item.contact.company}`}
          accessibilityHint="Double tap to expand lead details"
          accessibilityState={{ expanded: isSelected }}
        >
          {/* Lead Header */}
          <View style={styles.leadHeader}>
            {item.contact.photoUri ? (
              <Image 
                source={{ uri: item.contact.photoUri }} 
                style={styles.leadPhoto}
                accessibilityLabel={`Photo of ${item.contact.name}`}
              />
            ) : (
              <View style={[styles.leadPhotoPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.leadPhotoInitials}>
                  {item.contact.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            )}
            
            <View style={styles.leadInfo}>
              <Text 
                style={[styles.leadName, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {item.contact.name}
              </Text>
              <Text 
                style={[styles.leadCompany, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.contact.title}, {item.contact.company}
              </Text>
            </View>
            
            <View style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(item.status, theme) }
            ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          
          {/* Expanded Content */}
          {isSelected && (
            <View style={styles.expandedContent}>
              <View style={styles.contactDetails}>
                <View style={styles.contactRow}>
                  <Ionicons name="mail-outline" size={16} color={theme.colors.textSecondary} />
                  <Text 
                    style={[styles.contactText, { color: theme.colors.text }]}
                    selectable
                  >
                    {item.contact.email}
                  </Text>
                </View>
                <View style={styles.contactRow}>
                  <Ionicons name="call-outline" size={16} color={theme.colors.textSecondary} />
                  <Text 
                    style={[styles.contactText, { color: theme.colors.text }]}
                    selectable
                  >
                    {item.contact.phone}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              
              <View style={styles.metaSection}>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>
                    Added:
                  </Text>
                  <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                    {formatDate(item.dateAdded)}
                  </Text>
                </View>
                {item.lastContactDate && (
                  <View style={styles.metaRow}>
                    <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>
                      Last Contact:
                    </Text>
                    <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                      {formatDate(item.lastContactDate)}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Enriched Data Section */}
              {!item.enriched && !isCurrentlyEnriching && (
                <TouchableOpacity
                  style={[styles.enrichButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => enrichLeadData(item.id)}
                  accessibilityLabel="Enrich lead data"
                  accessibilityRole="button"
                  accessibilityHint="Fetches additional information about this lead"
                >
                  <Ionicons name="analytics-outline" size={16} color="#fff" />
                  <Text style={styles.enrichButtonText}>Enrich Data</Text>
                </TouchableOpacity>
              )}
              
              {isCurrentlyEnriching && (
                <View style={styles.enrichingContainer}>
                  <ActivityIndicator color={theme.colors.primary} />
                  <Text style={[styles.enrichingText, { color: theme.colors.textSecondary }]}>
                    Enriching lead data...
                  </Text>
                </View>
              )}
              
              {item.enriched && item.enrichedData && (
                <View style={styles.enrichedDataContainer}>
                  <Text style={[styles.enrichedDataTitle, { color: theme.colors.text }]}>
                    Company Information
                  </Text>
                  
                  <View style={styles.enrichedDataGrid}>
                    {item.enrichedData.industry && (
                      <View style={styles.enrichedDataItem}>
                        <Ionicons name="business-outline" size={16} color={theme.colors.textSecondary} />
                        <View>
                          <Text style={[styles.enrichedDataLabel, { color: theme.colors.textSecondary }]}>
                            Industry
                          </Text>
                          <Text style={[styles.enrichedDataValue, { color: theme.colors.text }]}>
                            {item.enrichedData.industry}
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    {item.enrichedData.companySize && (
                      <View style={styles.enrichedDataItem}>
                        <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
                        <View>
                          <Text style={[styles.enrichedDataLabel, { color: theme.colors.textSecondary }]}>
                            Company Size
                          </Text>
                          <Text style={[styles.enrichedDataValue, { color: theme.colors.text }]}>
                            {item.enrichedData.companySize}
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    {item.enrichedData.revenue && (
                      <View style={styles.enrichedDataItem}>
                        <Ionicons name="cash-outline" size={16} color={theme.colors.textSecondary} />
                        <View>
                          <Text style={[styles.enrichedDataLabel, { color: theme.colors.textSecondary }]}>
                            Revenue
                          </Text>
                          <Text style={[styles.enrichedDataValue, { color: theme.colors.text }]}>
                            {item.enrichedData.revenue}
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    {item.enrichedData.founded && (
                      <View style={styles.enrichedDataItem}>
                        <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                        <View>
                          <Text style={[styles.enrichedDataLabel, { color: theme.colors.textSecondary }]}>
                            Founded
                          </Text>
                          <Text style={[styles.enrichedDataValue, { color: theme.colors.text }]}>
                            {item.enrichedData.founded}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  
                  {(item.enrichedData.linkedIn || item.enrichedData.twitter) && (
                    <View style={styles.socialLinks}>
                      {item.enrichedData.linkedIn && (
                        <TouchableOpacity 
                          style={[styles.socialButton, { backgroundColor: '#0077B5' }]}
                          accessibilityLabel="View LinkedIn profile"
                          accessibilityRole="button"
                        >
                          <Ionicons name="logo-linkedin" size={16} color="#fff" />
                          <Text style={styles.socialButtonText}>LinkedIn</Text>
                        </TouchableOpacity>
                      )}
                      
                      {item.enrichedData.twitter && (
                        <TouchableOpacity 
                          style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
                          accessibilityLabel="View Twitter profile"
                          accessibilityRole="button"
                        >
                          <Ionicons name="logo-twitter" size={16} color="#fff" />
                          <Text style={styles.socialButtonText}>Twitter</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}
              
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              
              {/* Notes Section */}
              <View style={styles.notesSection}>
                <Text style={[styles.notesTitle, { color: theme.colors.text }]}>
                  Notes
                </Text>
                
                {item.notes ? (
                  <Text style={[styles.notesText, { color: theme.colors.text }]}>
                    {item.notes}
                  </Text>
                ) : (
                  <Text style={[styles.noNotesText, { color: theme.colors.textSecondary }]}>
                    No notes yet. Add one below.
                  </Text>
                )}
                
                <View style={styles.addNoteContainer}>
                  <TextInput
                    style={[
                      styles.addNoteInput,
                      { 
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.backgroundDark,
                      }
                    ]}
                    placeholder="Add a note..."
                    placeholderTextColor={theme.colors.textLight}
                    multiline
                    accessibilityLabel="Add a note about this lead"
                    accessibilityHint="Enter text and press Add to save your note"
                  />
                  <TouchableOpacity
                    style={[styles.addNoteButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                      const noteInput = document.querySelector('input[placeholder="Add a note..."]') as HTMLInputElement;
                      if (noteInput && noteInput.value) {
                        addNoteToLead(item.id, noteInput.value);
                        noteInput.value = '';
                      }
                    }}
                    accessibilityLabel="Add note"
                    accessibilityRole="button"
                  >
                    <Text style={styles.addNoteButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              
              {/* Status Update Section */}
              <View style={styles.statusSection}>
                <Text style={[styles.statusTitle, { color: theme.colors.text }]}>
                  Update Status
                </Text>
                
                <View style={styles.statusButtons}>
                  {['New', 'Contacted', 'Qualified', 'Proposal', 'Closed'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        { 
                          backgroundColor: item.status === status 
                            ? getStatusColor(status as Lead['status'], theme)
                            : theme.colors.backgroundDark,
                        }
                      ]}
                      onPress={() => updateLeadStatus(item.id, status as Lead['status'])}
                      accessibilityLabel={`Set status to ${status}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: item.status === status }}
                    >
                      <Text 
                        style={[
                          styles.statusButtonText,
                          { color: item.status === status ? '#fff' : theme.colors.text }
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => {
                    // Navigate to contact details
                    navigation.navigate('CardView', { contact: item.contact });
                  }}
                  accessibilityLabel="View contact details"
                  accessibilityRole="button"
                >
                  <Ionicons name="person-outline" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>View Contact</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
                  onPress={() => {
                    // Send email
                    // This would typically open the email app
                  }}
                  accessibilityLabel="Send email"
                  accessibilityRole="button"
                >
                  <Ionicons name="mail-outline" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>Send Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  // Get color based on lead status
  const getStatusColor = (status: Lead['status'], theme: any) => {
    switch (status) {
      case 'New':
        return theme.colors.info;
      case 'Contacted':
        return theme.colors.primary;
      case 'Qualified':
        return theme.colors.secondary;
      case 'Proposal':
        return theme.colors.warning;
      case 'Closed':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text 
          style={[styles.title, { color: theme.colors.text }]}
          accessibilityRole="header"
        >
          My Leads
        </Text>
        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          accessibilityLabel="Add new lead"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: theme.colors.backgroundDark,
          borderColor: theme.colors.border,
        }
      ]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search leads..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search leads"
          accessibilityHint="Enter text to filter leads by name, company, or email"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {filteredLeads.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={theme.colors.textLight} />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
            No leads found
          </Text>
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            {searchQuery.length > 0 
              ? `No leads match "${searchQuery}"`
              : "You haven't added any leads yet"}
          </Text>
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              style={[styles.emptyStateButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setSearchQuery('')}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Text style={styles.emptyStateButtonText}>Clear Search</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.emptyStateButton, { backgroundColor: theme.colors.primary }]}
              accessibilityLabel="Add your first lead"
              accessibilityRole="button"
            >
              <Text style={styles.emptyStateButtonText}>Add Your First Lead</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredLeads}
          renderItem={renderLeadItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Leads list"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  leadCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  leadPhotoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leadPhotoInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  leadCompany: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: 16,
  },
  contactDetails: {
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  metaSection: {
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 14,
    width: 100,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  enrichButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  enrichButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  enrichingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  enrichingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  enrichedDataContainer: {
    marginVertical: 8,
  },
  enrichedDataTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  enrichedDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  enrichedDataItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '50%',
    marginBottom: 12,
  },
  enrichedDataLabel: {
    fontSize: 12,
    marginLeft: 8,
  },
  enrichedDataValue: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    marginTop: 8,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  notesSection: {
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  noNotesText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  addNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  addNoteInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    minHeight: 80,
    maxHeight: 120,
    fontSize: 14,
  },
  addNoteButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNoteButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  statusSection: {
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LeadsScreen;