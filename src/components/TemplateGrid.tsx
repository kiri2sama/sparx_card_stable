import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Animated,
  AccessibilityInfo,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { CardTheme } from './CardPreview';
import Badge from './Badge';

type TemplateGridProps = {
  templates: CardTheme[];
  selectedTemplateId: string;
  onSelect: (template: CardTheme) => void;
  numColumns?: number;
  showLabels?: boolean;
  showBadge?: boolean;
  newTemplateIds?: string[];
  popularTemplateIds?: string[];
};

const { width } = Dimensions.get('window');

const TemplateGrid: React.FC<TemplateGridProps> = ({ 
  templates, 
  selectedTemplateId, 
  onSelect,
  numColumns = 2,
  showLabels = true,
  showBadge = true,
  newTemplateIds = [],
  popularTemplateIds = []
}) => {
  const { theme } = useTheme();
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = React.useState(false);

  // Calculate item dimensions based on screen width and number of columns
  const getItemDimensions = () => {
    const spacing = theme.spacing.md;
    const availableWidth = width - (spacing * 2); // Account for container padding
    const columnSpacing = spacing * (numColumns - 1); // Space between columns
    const itemWidth = (availableWidth - columnSpacing) / numColumns;
    
    // For horizontal templates
    const horizontalHeight = itemWidth / 1.7; // Using the aspect ratio of 1.7:1
    
    // For vertical templates
    const verticalHeight = itemWidth * 1.5; // Using the aspect ratio of 0.65:1 (inverted)
    
    return {
      itemWidth,
      horizontalHeight,
      verticalHeight,
    };
  };
  
  const dimensions = getItemDimensions();

  React.useEffect(() => {
    // Check if screen reader is enabled
    const checkScreenReader = async () => {
      const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(screenReaderEnabled);
    };
    
    checkScreenReader();
    
    // Subscribe to screen reader changes
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );
    
    return () => {
      // Clean up subscription
      subscription.remove();
    };
  }, []);

  const renderItem = ({ item }: { item: CardTheme }) => {
    const isSelected = item.id === selectedTemplateId;
    const isNew = newTemplateIds.includes(item.id);
    const isPopular = popularTemplateIds.includes(item.id);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    
    // Determine badge text and status
    let badgeText = '';
    let badgeStatus: 'default' | 'success' | 'warning' | 'info' = 'default';
    
    if (isNew) {
      badgeText = 'New';
      badgeStatus = 'info';
    } else if (isPopular) {
      badgeText = 'Popular';
      badgeStatus = 'warning';
    }
    
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };
    
    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelect(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} template${isSelected ? ', currently selected' : ''}`}
        accessibilityHint="Double tap to select this template"
        accessibilityState={{ selected: isSelected }}
        style={[
          styles.templateItem,
          {
            width: dimensions.itemWidth,
            marginBottom: theme.spacing.md,
          },
        ]}
      >
        <Animated.View 
          style={[
            styles.templatePreview,
            {
              height: item.layout === 'vertical' 
                ? dimensions.verticalHeight 
                : dimensions.horizontalHeight,
              borderRadius: theme.borderRadius.lg,
              borderWidth: isSelected ? 3 : 0,
              borderColor: theme.colors.primary,
              transform: [{ scale: scaleAnim }],
              ...theme.shadows.md,
            }
          ]}
        >
          <LinearGradient
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradientBackground,
              { borderRadius: theme.borderRadius.lg - (isSelected ? 3 : 0) },
            ]}
          >
            {/* Template content preview */}
            <View style={styles.templateContent}>
              {/* Header line */}
              <View style={styles.previewHeader}>
                <View 
                  style={[
                    styles.previewAvatar, 
                    { backgroundColor: `${item.textColor}30` }
                  ]} 
                />
                <View style={styles.previewHeaderText}>
                  <View 
                    style={[
                      styles.previewTextLine, 
                      { 
                        backgroundColor: `${item.textColor}90`,
                        width: '80%',
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.previewTextLine, 
                      { 
                        backgroundColor: `${item.textColor}70`,
                        width: '60%',
                        height: 6,
                      }
                    ]} 
                  />
                </View>
              </View>
              
              {/* Contact info lines */}
              <View style={styles.previewContactInfo}>
                <View style={styles.previewContactRow}>
                  <View 
                    style={[
                      styles.previewIcon, 
                      { backgroundColor: `${item.textColor}30` }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.previewTextLine, 
                      { 
                        backgroundColor: `${item.textColor}70`,
                        width: '70%',
                      }
                    ]} 
                  />
                </View>
                <View style={styles.previewContactRow}>
                  <View 
                    style={[
                      styles.previewIcon, 
                      { backgroundColor: `${item.textColor}30` }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.previewTextLine, 
                      { 
                        backgroundColor: `${item.textColor}70`,
                        width: '60%',
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Selected indicator */}
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={theme.colors.primary} 
              />
            </View>
          )}
          
          {/* Badge for new or popular templates */}
          {showBadge && (badgeText !== '') && (
            <View style={styles.badgeContainer}>
              <Badge
                label={badgeText}
                size="sm"
                status={badgeStatus}
                variant="solid"
                rounded
              />
            </View>
          )}
        </Animated.View>
        
        {/* Template name */}
        {showLabels && (
          <Text 
            style={[
              styles.templateName,
              {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.sans,
                marginTop: theme.spacing.xs,
              }
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={templates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={[
          styles.columnWrapper,
          { justifyContent: numColumns > 1 ? 'space-between' : 'flex-start' }
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { padding: theme.spacing.md }
        ]}
        // For better accessibility with screen readers
        accessible={isScreenReaderEnabled}
        accessibilityLabel="Template grid"
        accessibilityHint="Select a template for your business card"
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  templateItem: {
    alignItems: 'center',
  },
  templatePreview: {
    overflow: 'hidden',
    width: '100%',
  },
  gradientBackground: {
    flex: 1,
    padding: 8,
  },
  templateContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  previewHeaderText: {
    flex: 1,
  },
  previewTextLine: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  previewContactInfo: {
    marginTop: 8,
  },
  previewContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  previewIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default TemplateGrid;