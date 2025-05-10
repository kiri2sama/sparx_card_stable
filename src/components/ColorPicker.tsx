import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView
} from 'react-native';
import { useTheme } from '../styles/ThemeProvider';

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  presetColors?: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onColorChange,
  presetColors = []
}) => {
  const { theme } = useTheme();
  const [hexValue, setHexValue] = useState(color.replace('#', ''));
  
  const handleHexChange = (text: string) => {
    // Remove any non-hex characters
    const cleanedText = text.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
    setHexValue(cleanedText);
    
    // Only update the color if we have a valid hex
    if (cleanedText.length === 6) {
      onColorChange(`#${cleanedText}`);
    }
  };
  
  const handlePresetSelect = (presetColor: string) => {
    onColorChange(presetColor);
    setHexValue(presetColor.replace('#', ''));
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.colorPreview}>
        <View 
          style={[
            styles.colorSwatch, 
            { backgroundColor: color }
          ]} 
        />
        <View style={styles.hexInputContainer}>
          <Text style={[styles.hashSymbol, { color: theme.colors.text }]}>#</Text>
          <TextInput
            style={[
              styles.hexInput,
              { color: theme.colors.text }
            ]}
            value={hexValue}
            onChangeText={handleHexChange}
            placeholder="FFFFFF"
            placeholderTextColor={theme.colors.placeholder}
            maxLength={6}
            autoCapitalize="characters"
          />
        </View>
      </View>
      
      {presetColors.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetContainer}
        >
          {presetColors.map((presetColor, index) => (
            <TouchableOpacity
              key={`${presetColor}-${index}`}
              style={[
                styles.presetColor,
                { backgroundColor: presetColor },
                color === presetColor && styles.selectedPreset
              ]}
              onPress={() => handlePresetSelect(presetColor)}
              accessibilityLabel={`Select color ${presetColor}`}
              accessibilityRole="button"
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  hexInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  hashSymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  hexInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  presetContainer: {
    paddingVertical: 8,
  },
  presetColor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectedPreset: {
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default ColorPicker;