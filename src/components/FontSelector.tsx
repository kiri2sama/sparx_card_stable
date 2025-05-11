import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Platform
} from 'react-native';
import { useTheme } from '../styles/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface FontSelectorProps {
  selectedFont: string;
  onSelectFont: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ 
  selectedFont, 
  onSelectFont 
}) => {
  const { theme } = useTheme();
  const [showFontList, setShowFontList] = useState(false);
  
  // Available fonts - these are system fonts that should be available on most devices
  const availableFonts = Platform.OS === 'ios' 
    ? [
        { name: 'System', value: 'System' },
        { name: 'San Francisco', value: 'San Francisco' },
        { name: 'SF Pro Display', value: 'SF Pro Display' },
        { name: 'SF Pro Text', value: 'SF Pro Text' },
        { name: 'New York', value: 'New York' },
        { name: 'Academy Engraved LET', value: 'Academy Engraved LET' },
        { name: 'American Typewriter', value: 'American Typewriter' },
        { name: 'Arial', value: 'Arial' },
        { name: 'Avenir', value: 'Avenir' },
        { name: 'Baskerville', value: 'Baskerville' },
        { name: 'Chalkboard SE', value: 'Chalkboard SE' },
        { name: 'Courier New', value: 'Courier New' },
        { name: 'Georgia', value: 'Georgia' },
        { name: 'Gill Sans', value: 'Gill Sans' },
        { name: 'Helvetica', value: 'Helvetica' },
        { name: 'Helvetica Neue', value: 'Helvetica Neue' },
        { name: 'Palatino', value: 'Palatino' },
        { name: 'Times New Roman', value: 'Times New Roman' },
        { name: 'Trebuchet MS', value: 'Trebuchet MS' },
        { name: 'Verdana', value: 'Verdana' },
      ]
    : [
        { name: 'System', value: 'System' },
        { name: 'Roboto', value: 'Roboto' },
        { name: 'Roboto Condensed', value: 'Roboto Condensed' },
        { name: 'Roboto Mono', value: 'Roboto Mono' },
        { name: 'Roboto Slab', value: 'Roboto Slab' },
        { name: 'Noto Sans', value: 'Noto Sans' },
        { name: 'Noto Serif', value: 'Noto Serif' },
        { name: 'Droid Sans', value: 'Droid Sans' },
        { name: 'Droid Serif', value: 'Droid Serif' },
        { name: 'Droid Sans Mono', value: 'Droid Sans Mono' },
        { name: 'Lato', value: 'Lato' },
        { name: 'Montserrat', value: 'Montserrat' },
        { name: 'Open Sans', value: 'Open Sans' },
        { name: 'Oswald', value: 'Oswald' },
        { name: 'Raleway', value: 'Raleway' },
        { name: 'Source Sans Pro', value: 'Source Sans Pro' },
        { name: 'Ubuntu', value: 'Ubuntu' },
        { name: 'serif', value: 'serif' },
        { name: 'sans-serif', value: 'sans-serif' },
        { name: 'monospace', value: 'monospace' },
      ];
  
  const selectedFontObj = availableFonts.find(font => font.value === selectedFont) || availableFonts[0];
  
  const renderFontItem = ({ item }: { item: { name: string, value: string } }) => (
    <TouchableOpacity
      style={[
        styles.fontItem,
        selectedFont === item.value && { backgroundColor: theme.colors.primary + '20' }
      ]}
      onPress={() => {
        onSelectFont(item.value);
        setShowFontList(false);
      }}
      accessibilityLabel={`Select font ${item.name}`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selectedFont === item.value }}
    >
      <Text style={[
        styles.fontItemText, 
        { color: theme.colors.text, fontFamily: item.value }
      ]}>
        {item.name}
      </Text>
      
      {selectedFont === item.value && (
        <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.fontSelector,
          { 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border
          }
        ]}
        onPress={() => setShowFontList(!showFontList)}
        accessibilityLabel="Select font"
        accessibilityRole="button"
      >
        <Text style={[
          styles.selectedFontText,
          { color: theme.colors.text, fontFamily: selectedFontObj.value }
        ]}>
          {selectedFontObj.name}
        </Text>
        
        <Ionicons 
          name={showFontList ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={theme.colors.textSecondary} 
        />
      </TouchableOpacity>
      
      {showFontList && (
        <View style={[
          styles.fontList,
          { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border
          }
        ]}>
          <FlatList
            data={availableFonts}
            renderItem={renderFontItem}
            keyExtractor={(item) => item.value}
            style={styles.list}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    zIndex: 1,
  },
  fontSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  selectedFontText: {
    fontSize: 16,
  },
  fontList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  list: {
    flex: 1,
  },
  fontItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  fontItemText: {
    fontSize: 16,
  },
});

export default FontSelector;