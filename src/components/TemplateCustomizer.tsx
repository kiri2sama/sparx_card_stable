import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { BusinessCard } from '../types/businessCard';

// Note: We're using a placeholder for ColorPicker since we haven't installed the package yet
// In a real implementation, you would install react-native-color-picker or similar
const ColorPickerPlaceholder = ({ color, onColorChange }: { color: string, onColorChange: (color: string) => void }) => {
  return (
    <View style={styles.colorPickerPlaceholder}>
      <Text>Color Picker Placeholder</Text>
      <View style={[styles.colorSwatch, { backgroundColor: color }]} />
      <TextInput
        label="Color (hex)"
        value={color}
        onChangeText={onColorChange}
        style={styles.colorInput}
      />
    </View>
  );
};

interface TemplateCustomizerProps {
  businessCard: BusinessCard;
  onSave: (updatedCard: BusinessCard) => void;
  onCancel: () => void;
}

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({ 
  businessCard, 
  onSave, 
  onCancel 
}) => {
  // Initialize template if it doesn't exist
  const initialTemplate = businessCard.template || {
    id: 'default',
    colors: {
      primary: '#6200ee',
      secondary: '#03dac4',
      background: '#ffffff',
      text: '#000000',
      accent: '#ff4081'
    },
    fonts: {
      primary: 'System',
      secondary: 'System'
    },
    layout: 'standard'
  };

  const [template, setTemplate] = useState(initialTemplate);
  const [fontFamily, setFontFamily] = useState(template.fonts.primary);
  
  // Update a specific color in the template
  const updateColor = (colorKey: keyof typeof template.colors, value: string) => {
    setTemplate({
      ...template,
      colors: {
        ...template.colors,
        [colorKey]: value
      }
    });
  };

  // Handle saving the template
  const handleSave = () => {
    const updatedCard: BusinessCard = {
      ...businessCard,
      template
    };
    onSave(updatedCard);
  };

  // Available layout options
  const layoutOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Modern', value: 'modern' },
    { label: 'Minimal', value: 'minimal' },
    { label: 'Bold', value: 'bold' },
    { label: 'Creative', value: 'creative' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Customize Template</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Layout</Text>
        <View style={styles.layoutOptions}>
          {layoutOptions.map(option => (
            <Button
              key={option.value}
              mode={template.layout === option.value ? 'contained' : 'outlined'}
              onPress={() => setTemplate({ ...template, layout: option.value })}
              style={styles.layoutButton}
            >
              {option.label}
            </Button>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Colors</Text>
        
        <Text style={styles.colorLabel}>Primary Color</Text>
        <ColorPickerPlaceholder 
          color={template.colors.primary} 
          onColorChange={(color) => updateColor('primary', color)} 
        />
        
        <Text style={styles.colorLabel}>Secondary Color</Text>
        <ColorPickerPlaceholder 
          color={template.colors.secondary} 
          onColorChange={(color) => updateColor('secondary', color)} 
        />
        
        <Text style={styles.colorLabel}>Background Color</Text>
        <ColorPickerPlaceholder 
          color={template.colors.background} 
          onColorChange={(color) => updateColor('background', color)} 
        />
        
        <Text style={styles.colorLabel}>Text Color</Text>
        <ColorPickerPlaceholder 
          color={template.colors.text} 
          onColorChange={(color) => updateColor('text', color)} 
        />
        
        <Text style={styles.colorLabel}>Accent Color</Text>
        <ColorPickerPlaceholder 
          color={template.colors.accent} 
          onColorChange={(color) => updateColor('accent', color)} 
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography</Text>
        
        <TextInput
          label="Primary Font"
          value={template.fonts.primary}
          onChangeText={(value) => setTemplate({
            ...template,
            fonts: { ...template.fonts, primary: value }
          })}
          style={styles.input}
        />
        
        <TextInput
          label="Secondary Font"
          value={template.fonts.secondary}
          onChangeText={(value) => setTemplate({
            ...template,
            fonts: { ...template.fonts, secondary: value }
          })}
          style={styles.input}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          onPress={onCancel} 
          style={styles.button}
        >
          Cancel
        </Button>
        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.button}
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  colorPickerPlaceholder: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 8,
  },
  colorInput: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  layoutOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  layoutButton: {
    marginBottom: 8,
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 40,
  },
  button: {
    width: '48%',
  },
});

export default TemplateCustomizer;