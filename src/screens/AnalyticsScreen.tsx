import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { getSavedBusinessCards } from '../utils/storageUtils';
import { BusinessCard } from '../types/businessCard';
import CardPreview from '../components/CardPreview';

// Mock analytics data - in a real app, this would come from a backend
const generateMockAnalytics = (cardId: string) => {
  const baseViews = Math.floor(Math.random() * 50) + 10;
  const baseShares = Math.floor(Math.random() * 20) + 5;
  const baseScans = Math.floor(Math.random() * 30) + 8;
  
  return {
    cardId,
    views: {
      today: Math.floor(Math.random() * 5),
      thisWeek: Math.floor(Math.random() * 15) + 5,
      thisMonth: baseViews,
      total: baseViews + Math.floor(Math.random() * 100)
    },
    shares: {
      today: Math.floor(Math.random() * 3),
      thisWeek: Math.floor(Math.random() * 8) + 2,
      thisMonth: baseShares,
      total: baseShares + Math.floor(Math.random() * 50)
    },
    scans: {
      today: Math.floor(Math.random() * 4),
      thisWeek: Math.floor(Math.random() * 10) + 3,
      thisMonth: baseScans,
      total: baseScans + Math.floor(Math.random() * 70)
    },
    leads: Math.floor(Math.random() * 15) + 2,
    conversions: Math.floor(Math.random() * 5),
    topReferrers: [
      { source: 'Direct Scan', count: Math.floor(Math.random() * 20) + 5 },
      { source: 'Email', count: Math.floor(Math.random() * 15) + 3 },
      { source: 'Website', count: Math.floor(Math.random() * 10) + 2 }
    ]
  };
};

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'today' | 'thisWeek' | 'thisMonth' | 'total'>('thisMonth');
  
  useEffect(() => {
    loadCards();
  }, []);
  
  useEffect(() => {
    if (selectedCard && selectedCard.id) {
      // In a real app, you would fetch analytics from a backend
      const mockData = generateMockAnalytics(selectedCard.id);
      setAnalytics(mockData);
    }
  }, [selectedCard]);
  
  const loadCards = async () => {
    try {
      setLoading(true);
      const savedCards = await getSavedBusinessCards();
      setCards(savedCards);
      
      // Select the first card by default
      if (savedCards.length > 0) {
        setSelectedCard(savedCards[0]);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderTimeframeSelector = () => {
    const options = [
      { value: 'today', label: 'Today' },
      { value: 'thisWeek', label: 'This Week' },
      { value: 'thisMonth', label: 'This Month' },
      { value: 'total', label: 'Total' }
    ];
    
    return (
      <View style={styles.timeframeSelector}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.timeframeOption,
              timeframe === option.value && { 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary
              }
            ]}
            onPress={() => setTimeframe(option.value as any)}
            accessibilityLabel={option.label}
            accessibilityRole="radio"
            accessibilityState={{ checked: timeframe === option.value }}
          >
            <Text style={[
              styles.timeframeText,
              timeframe === option.value ? { color: '#fff' } : { color: theme.colors.text }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderStatCard = (title: string, value: number, icon: string, color: string) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>
          {value}
        </Text>
        <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>
          {title}
        </Text>
      </View>
    </View>
  );
  
  const renderCardSelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cardSelectorContainer}
    >
      {cards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={[
            styles.cardSelectorItem,
            selectedCard?.id === card.id && { 
              borderColor: theme.colors.primary,
              borderWidth: 2
            }
          ]}
          onPress={() => setSelectedCard(card)}
          accessibilityLabel={`Select ${card.name}'s card for analytics`}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedCard?.id === card.id }}
        >
          <CardPreview card={card} small />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading analytics...
        </Text>
      </View>
    );
  }
  
  if (cards.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Analytics
          </Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="analytics-outline" 
            size={64} 
            color={theme.colors.textSecondary} 
            style={styles.emptyIcon} 
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No Cards Found
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Create a business card to start tracking analytics
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
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Analytics
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Card Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Select Card
          </Text>
          {renderCardSelector()}
        </View>
        
        {/* Timeframe Selector */}
        <View style={styles.section}>
          {renderTimeframeSelector()}
        </View>
        
        {/* Stats Overview */}
        {analytics && (
          <>
            <View style={styles.statsGrid}>
              {renderStatCard(
                'Views', 
                analytics.views[timeframe], 
                'eye-outline', 
                theme.colors.primary
              )}
              {renderStatCard(
                'Shares', 
                analytics.shares[timeframe], 
                'share-social-outline', 
                theme.colors.secondary
              )}
              {renderStatCard(
                'Scans', 
                analytics.scans[timeframe], 
                'scan-outline', 
                theme.colors.success
              )}
              {renderStatCard(
                'Leads', 
                analytics.leads, 
                'people-outline', 
                theme.colors.warning
              )}
            </View>
            
            {/* Engagement Rate */}
            <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Engagement Rate
              </Text>
              
              <View style={styles.engagementContainer}>
                <View style={styles.engagementBar}>
                  <View 
                    style={[
                      styles.engagementFill, 
                      { 
                        backgroundColor: theme.colors.primary,
                        width: `${Math.min(analytics.views.total / 10, 100)}%`
                      }
                    ]} 
                  />
                </View>
                
                <Text style={[styles.engagementText, { color: theme.colors.textSecondary }]}>
                  {Math.min(Math.round(analytics.views.total / 10), 100)}% of average
                </Text>
              </View>
            </View>
            
            {/* Top Referrers */}
            <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Top Referrers
              </Text>
              
              {analytics.topReferrers.map((referrer: any, index: number) => (
                <View key={referrer.source} style={styles.referrerItem}>
                  <Text style={[styles.referrerName, { color: theme.colors.text }]}>
                    {referrer.source}
                  </Text>
                  <Text style={[styles.referrerCount, { color: theme.colors.textSecondary }]}>
                    {referrer.count} views
                  </Text>
                </View>
              ))}
            </View>
            
            {/* View Detailed Analytics */}
            <TouchableOpacity
              style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {}}
              accessibilityLabel="View detailed analytics"
              accessibilityRole="button"
            >
              <Text style={styles.detailsButtonText}>View Detailed Analytics</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  cardSelectorContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cardSelectorItem: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeframeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  timeframeOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 8,
  },
  statCard: {
    width: '50%',
    padding: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
  },
  engagementContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  engagementBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  engagementFill: {
    height: '100%',
    borderRadius: 4,
  },
  engagementText: {
    fontSize: 14,
    textAlign: 'right',
  },
  referrerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  referrerName: {
    fontSize: 16,
  },
  referrerCount: {
    fontSize: 16,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default AnalyticsScreen;