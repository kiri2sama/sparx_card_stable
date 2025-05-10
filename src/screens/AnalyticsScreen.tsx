import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import Svg, { 
  Circle, 
  Path, 
  G, 
  Line, 
  Rect, 
  Text as SvgText 
} from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 200;

// Mock data for analytics
const mockData = {
  cardShares: {
    total: 87,
    weekly: [12, 8, 15, 22, 10, 14, 6],
    byMethod: {
      nfc: 42,
      qr: 28,
      email: 12,
      wallet: 5,
    },
  },
  leads: {
    total: 34,
    conversion: 0.39, // 39% of shares converted to leads
    byStatus: {
      new: 12,
      contacted: 8,
      qualified: 6,
      proposal: 5,
      closed: 3,
    },
  },
  views: {
    total: 156,
    weekly: [18, 22, 25, 30, 24, 20, 17],
  },
  topLocations: [
    { name: 'San Francisco', count: 28 },
    { name: 'New York', count: 22 },
    { name: 'Chicago', count: 15 },
    { name: 'Los Angeles', count: 12 },
    { name: 'Seattle', count: 10 },
  ],
};

type AnalyticsScreenProps = {
  navigation: any;
};

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Animation values
  const shareCountAnim = React.useRef(new Animated.Value(0)).current;
  const leadCountAnim = React.useRef(new Animated.Value(0)).current;
  const viewCountAnim = React.useRef(new Animated.Value(0)).current;
  
  // Animate counts on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(shareCountAnim, {
        toValue: mockData.cardShares.total,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(leadCountAnim, {
        toValue: mockData.leads.total,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(viewCountAnim, {
        toValue: mockData.views.total,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);
  
  // Interpolate animated values to display
  const displayShareCount = shareCountAnim.interpolate({
    inputRange: [0, mockData.cardShares.total],
    outputRange: ['0', mockData.cardShares.total.toString()],
  });
  
  const displayLeadCount = leadCountAnim.interpolate({
    inputRange: [0, mockData.leads.total],
    outputRange: ['0', mockData.leads.total.toString()],
  });
  
  const displayViewCount = viewCountAnim.interpolate({
    inputRange: [0, mockData.views.total],
    outputRange: ['0', mockData.views.total.toString()],
  });
  
  // Line chart for weekly data
  const renderLineChart = (data: number[], color: string) => {
    // Calculate points for the path
    const dataPoints = data.length;
    const xStep = CHART_WIDTH / (dataPoints - 1);
    const maxValue = Math.max(...data) * 1.2; // Add 20% padding at top
    
    // Create path string
    let pathD = `M 0 ${CHART_HEIGHT - (data[0] / maxValue) * CHART_HEIGHT}`;
    
    for (let i = 1; i < dataPoints; i++) {
      const x = i * xStep;
      const y = CHART_HEIGHT - (data[i] / maxValue) * CHART_HEIGHT;
      pathD += ` L ${x} ${y}`;
    }
    
    // Create dots array
    const dots = data.map((value, index) => {
      const x = index * xStep;
      const y = CHART_HEIGHT - (value / maxValue) * CHART_HEIGHT;
      return { x, y, value };
    });
    
    return (
      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, index) => (
            <Line
              key={`grid-${index}`}
              x1="0"
              y1={CHART_HEIGHT * ratio}
              x2={CHART_WIDTH}
              y2={CHART_HEIGHT * ratio}
              stroke={theme.colors.border}
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}
          
          {/* X-axis */}
          <Line
            x1="0"
            y1={CHART_HEIGHT}
            x2={CHART_WIDTH}
            y2={CHART_HEIGHT}
            stroke={theme.colors.border}
            strokeWidth="1"
          />
          
          {/* Line path */}
          <Path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
          
          {/* Data points */}
          {dots.map((dot, index) => (
            <G key={`dot-${index}`}>
              <Circle
                cx={dot.x}
                cy={dot.y}
                r="4"
                fill="#fff"
                stroke={color}
                strokeWidth="2"
              />
              <SvgText
                x={dot.x}
                y={dot.y - 15}
                fill={theme.colors.text}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                {dot.value}
              </SvgText>
            </G>
          ))}
          
          {/* X-axis labels */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <SvgText
              key={`day-${index}`}
              x={index * xStep}
              y={CHART_HEIGHT + 20}
              fill={theme.colors.textSecondary}
              fontSize="10"
              textAnchor="middle"
            >
              {day}
            </SvgText>
          ))}
        </Svg>
      </View>
    );
  };
  
  // Pie chart for share methods
  const renderPieChart = () => {
    const { nfc, qr, email, wallet } = mockData.cardShares.byMethod;
    const total = nfc + qr + email + wallet;
    
    // Calculate angles for each segment
    const nfcAngle = (nfc / total) * 360;
    const qrAngle = (qr / total) * 360;
    const emailAngle = (email / total) * 360;
    const walletAngle = (wallet / total) * 360;
    
    // Calculate SVG paths for pie segments
    const radius = 80;
    const centerX = CHART_WIDTH / 2;
    const centerY = radius + 20;
    
    // Helper function to create pie segment path
    const createPieSegment = (startAngle: number, endAngle: number, color: string) => {
      // Convert angles to radians
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      // Calculate start and end points
      const startX = centerX + radius * Math.cos(startRad);
      const startY = centerY + radius * Math.sin(startRad);
      const endX = centerX + radius * Math.cos(endRad);
      const endY = centerY + radius * Math.sin(endRad);
      
      // Create arc flag (0 for minor arc, 1 for major arc)
      const arcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      
      // Create SVG path
      const path = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${arcFlag} 1 ${endX} ${endY} Z`;
      
      return (
        <Path
          d={path}
          fill={color}
        />
      );
    };
    
    // Calculate start angles for each segment
    let currentAngle = 0;
    
    const nfcSegment = createPieSegment(currentAngle, currentAngle + nfcAngle, theme.colors.primary);
    currentAngle += nfcAngle;
    
    const qrSegment = createPieSegment(currentAngle, currentAngle + qrAngle, theme.colors.secondary);
    currentAngle += qrAngle;
    
    const emailSegment = createPieSegment(currentAngle, currentAngle + emailAngle, theme.colors.warning);
    currentAngle += emailAngle;
    
    const walletSegment = createPieSegment(currentAngle, currentAngle + walletAngle, theme.colors.info);
    
    // Create legend items
    const legendItems = [
      { label: 'NFC', value: nfc, color: theme.colors.primary, percentage: Math.round((nfc / total) * 100) },
      { label: 'QR Code', value: qr, color: theme.colors.secondary, percentage: Math.round((qr / total) * 100) },
      { label: 'Email', value: email, color: theme.colors.warning, percentage: Math.round((email / total) * 100) },
      { label: 'Wallet', value: wallet, color: theme.colors.info, percentage: Math.round((wallet / total) * 100) },
    ];
    
    return (
      <View style={styles.pieChartContainer}>
        <Svg width={CHART_WIDTH} height={radius * 2 + 40}>
          {nfcSegment}
          {qrSegment}
          {emailSegment}
          {walletSegment}
          
          {/* Center circle (optional for donut chart) */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius / 2.5}
            fill={theme.colors.background}
          />
          
          <SvgText
            x={centerX}
            y={centerY - 10}
            fill={theme.colors.text}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {total}
          </SvgText>
          
          <SvgText
            x={centerX}
            y={centerY + 10}
            fill={theme.colors.textSecondary}
            fontSize="12"
            textAnchor="middle"
          >
            Total
          </SvgText>
        </Svg>
        
        <View style={styles.legendContainer}>
          {legendItems.map((item, index) => (
            <View key={`legend-${index}`} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendText}>
                <Text style={[styles.legendLabel, { color: theme.colors.text }]}>
                  {item.label}
                </Text>
                <Text style={[styles.legendValue, { color: theme.colors.textSecondary }]}>
                  {item.value} ({item.percentage}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  // Bar chart for lead status
  const renderBarChart = () => {
    const { new: newLeads, contacted, qualified, proposal, closed } = mockData.leads.byStatus;
    const data = [
      { label: 'New', value: newLeads, color: theme.colors.info },
      { label: 'Contacted', value: contacted, color: theme.colors.primary },
      { label: 'Qualified', value: qualified, color: theme.colors.secondary },
      { label: 'Proposal', value: proposal, color: theme.colors.warning },
      { label: 'Closed', value: closed, color: theme.colors.success },
    ];
    
    const maxValue = Math.max(...data.map(item => item.value)) * 1.2; // Add 20% padding
    const barWidth = CHART_WIDTH / data.length - 16;
    
    return (
      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 40}>
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, index) => (
            <Line
              key={`grid-${index}`}
              x1="0"
              y1={CHART_HEIGHT * ratio}
              x2={CHART_WIDTH}
              y2={CHART_HEIGHT * ratio}
              stroke={theme.colors.border}
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}
          
          {/* X-axis */}
          <Line
            x1="0"
            y1={CHART_HEIGHT}
            x2={CHART_WIDTH}
            y2={CHART_HEIGHT}
            stroke={theme.colors.border}
            strokeWidth="1"
          />
          
          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * CHART_HEIGHT;
            const x = index * (CHART_WIDTH / data.length) + (CHART_WIDTH / data.length - barWidth) / 2;
            const y = CHART_HEIGHT - barHeight;
            
            return (
              <G key={`bar-${index}`}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.color}
                  rx={8}
                  ry={8}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 10}
                  fill={theme.colors.text}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {item.value}
                </SvgText>
                <SvgText
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT + 20}
                  fill={theme.colors.textSecondary}
                  fontSize="10"
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    );
  };
  
  // Render overview tab content
  const renderOverviewTab = () => {
    return (
      <View style={styles.tabContent}>
        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.summaryIconContainer}>
              <View style={[styles.summaryIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="share-social-outline" size={20} color={theme.colors.primary} />
              </View>
            </View>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Card Shares
            </Text>
            <Animated.Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {displayShareCount}
            </Animated.Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.summaryIconContainer}>
              <View style={[styles.summaryIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Ionicons name="people-outline" size={20} color={theme.colors.secondary} />
              </View>
            </View>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Leads
            </Text>
            <Animated.Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {displayLeadCount}
            </Animated.Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.summaryIconContainer}>
              <View style={[styles.summaryIcon, { backgroundColor: theme.colors.info + '20' }]}>
                <Ionicons name="eye-outline" size={20} color={theme.colors.info} />
              </View>
            </View>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Profile Views
            </Text>
            <Animated.Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {displayViewCount}
            </Animated.Text>
          </View>
        </View>
        
        {/* Weekly Shares Chart */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              Weekly Card Shares
            </Text>
            <View style={styles.periodSelector}>
              {['week', 'month', 'year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && { 
                      backgroundColor: theme.colors.primary + '20' 
                    }
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                  accessibilityLabel={`View ${period} data`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedPeriod === period }}
                >
                  <Text 
                    style={[
                      styles.periodButtonText,
                      { 
                        color: selectedPeriod === period 
                          ? theme.colors.primary 
                          : theme.colors.textSecondary 
                      }
                    ]}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {renderLineChart(mockData.cardShares.weekly, theme.colors.primary)}
        </View>
        
        {/* Share Methods Chart */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Share Methods
          </Text>
          {renderPieChart()}
        </View>
        
        {/* Lead Status Chart */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Leads by Status
          </Text>
          {renderBarChart()}
        </View>
        
        {/* Top Locations */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Top Locations
          </Text>
          
          {mockData.topLocations.map((location, index) => {
            const percentage = (location.count / mockData.views.total) * 100;
            
            return (
              <View key={`location-${index}`} style={styles.locationItem}>
                <View style={styles.locationInfo}>
                  <Text style={[styles.locationName, { color: theme.colors.text }]}>
                    {location.name}
                  </Text>
                  <Text style={[styles.locationCount, { color: theme.colors.textSecondary }]}>
                    {location.count} views
                  </Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        backgroundColor: theme.colors.primary,
                        width: `${percentage}%` 
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  
  // Render shares tab content
  const renderSharesTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Weekly Share Activity
          </Text>
          {renderLineChart(mockData.cardShares.weekly, theme.colors.primary)}
        </View>
        
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Share Methods
          </Text>
          {renderPieChart()}
        </View>
        
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Share to Lead Conversion
          </Text>
          
          <View style={styles.conversionContainer}>
            <View style={styles.conversionTextContainer}>
              <Text style={[styles.conversionRate, { color: theme.colors.text }]}>
                {(mockData.leads.conversion * 100).toFixed(0)}%
              </Text>
              <Text style={[styles.conversionLabel, { color: theme.colors.textSecondary }]}>
                Conversion Rate
              </Text>
            </View>
            
            <View style={styles.conversionStats}>
              <View style={styles.conversionStat}>
                <Text style={[styles.conversionStatValue, { color: theme.colors.primary }]}>
                  {mockData.cardShares.total}
                </Text>
                <Text style={[styles.conversionStatLabel, { color: theme.colors.textSecondary }]}>
                  Total Shares
                </Text>
              </View>
              
              <View style={styles.conversionStatDivider} />
              
              <View style={styles.conversionStat}>
                <Text style={[styles.conversionStatValue, { color: theme.colors.secondary }]}>
                  {mockData.leads.total}
                </Text>
                <Text style={[styles.conversionStatLabel, { color: theme.colors.textSecondary }]}>
                  Leads Generated
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  // Render leads tab content
  const renderLeadsTab = () => {
    return (
      <View style={styles.tabContent}>
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Leads by Status
          </Text>
          {renderBarChart()}
        </View>
        
        <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Lead Funnel
          </Text>
          
          <View style={styles.funnelContainer}>
            {Object.entries(mockData.leads.byStatus).map(([status, count], index) => {
              const percentage = (count / mockData.leads.total) * 100;
              const width = 100 - (index * 10);
              
              return (
                <View 
                  key={`funnel-${index}`} 
                  style={[
                    styles.funnelSegment,
                    { 
                      width: `${width}%`,
                      backgroundColor: getFunnelColor(status, theme),
                    }
                  ]}
                >
                  <Text style={styles.funnelText}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}: {count}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Leads')}
          accessibilityLabel="View all leads"
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>View All Leads</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };
  
  // Helper function to get funnel segment color
  const getFunnelColor = (status: string, theme: any) => {
    switch (status) {
      case 'new':
        return theme.colors.info;
      case 'contacted':
        return theme.colors.primary;
      case 'qualified':
        return theme.colors.secondary;
      case 'proposal':
        return theme.colors.warning;
      case 'closed':
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
          Analytics
        </Text>
        
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: theme.colors.backgroundDark }]}
          accessibilityLabel="Refresh analytics"
          accessibilityRole="button"
        >
          <Ionicons name="refresh" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.tabBar, { backgroundColor: theme.colors.backgroundDark }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'overview' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            }
          ]}
          onPress={() => setActiveTab('overview')}
          accessibilityLabel="Overview tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'overview' }}
        >
          <Text 
            style={[
              styles.tabButtonText,
              { color: activeTab === 'overview' ? '#fff' : theme.colors.text }
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'shares' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            }
          ]}
          onPress={() => setActiveTab('shares')}
          accessibilityLabel="Shares tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'shares' }}
        >
          <Text 
            style={[
              styles.tabButtonText,
              { color: activeTab === 'shares' ? '#fff' : theme.colors.text }
            ]}
          >
            Shares
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'leads' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            }
          ]}
          onPress={() => setActiveTab('leads')}
          accessibilityLabel="Leads tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'leads' }}
        >
          <Text 
            style={[
              styles.tabButtonText,
              { color: activeTab === 'leads' ? '#fff' : theme.colors.text }
            ]}
          >
            Leads
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'shares' && renderSharesTab()}
        {activeTab === 'leads' && renderLeadsTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabButtonText: {
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: '31%',
    borderRadius: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryIconContainer: {
    marginBottom: 8,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 10,
  },
  locationItem: {
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationCount: {
    fontSize: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  conversionContainer: {
    alignItems: 'center',
  },
  conversionTextContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  conversionRate: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  conversionLabel: {
    fontSize: 14,
  },
  conversionStats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  conversionStat: {
    alignItems: 'center',
  },
  conversionStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  conversionStatLabel: {
    fontSize: 12,
  },
  conversionStatDivider: {
    height: 40,
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  funnelContainer: {
    alignItems: 'center',
  },
  funnelSegment: {
    height: 40,
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  funnelText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
});

export default AnalyticsScreen;