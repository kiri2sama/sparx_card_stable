import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

interface AccessibilityInfoProps {
  onClose: () => void;
}

const AccessibilityInfo: React.FC<AccessibilityInfoProps> = ({ onClose }) => {
  const { t } = useTranslation();
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Accessibility Features</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Screen Reader Support</Text>
        <Text style={styles.text}>
          SparX Card is fully compatible with screen readers. All buttons, 
          inputs, and interactive elements have appropriate accessibility labels.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Commands</Text>
        <Text style={styles.text}>
          You can use voice commands to navigate the app. Try saying:
        </Text>
        <View style={styles.commandList}>
          <Text style={styles.command}>"Create new card"</Text>
          <Text style={styles.command}>"Scan NFC card"</Text>
          <Text style={styles.command}>"Show my saved cards"</Text>
          <Text style={styles.command}>"Go to profile"</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Size</Text>
        <Text style={styles.text}>
          SparX Card respects your device's text size settings. You can adjust 
          the text size in your device settings, and the app will adapt accordingly.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Contrast</Text>
        <Text style={styles.text}>
          We've designed the app with high contrast colors to ensure readability 
          for users with visual impairments.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Keyboard Navigation</Text>
        <Text style={styles.text}>
          All interactive elements can be accessed using keyboard navigation 
          for users who rely on external keyboards.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <Text style={styles.text}>
          We're committed to making SparX Card accessible to everyone. If you 
          encounter any accessibility issues or have suggestions for improvement, 
          please contact us at accessibility@sparxcard.com.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onClose}
        accessibilityLabel="Close accessibility information"
        accessibilityRole="button"
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0066cc',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  commandList: {
    marginTop: 8,
    marginLeft: 16,
  },
  command: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccessibilityInfo;