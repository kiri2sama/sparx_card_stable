import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { BusinessCard } from '../types/businessCard';
import QRCode from 'react-native-qrcode-svg';
import { businessCardToPayload } from '../utils/nfcUtils';
import ColorPicker from '../components/ColorPicker';

type QRCustomizationParams = {
  businessCard: BusinessCard;
  onSave?: (qrOptions: QROptions) => void;
};

interface QROptions {
  color: string;
  backgroundColor: string;
  logo?: string;
  logoSize?: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  enableGradient: boolean;
  gradientColors?: string[];
}

const QRCustomizationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  
  const { businessCard, onSave } = route.params as QRCustomizationParams || {};
  
  const [qrOptions, setQROptions] = useState<QROptions>({
    color: '#000000',
    backgroundColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
    enableGradient: false,
    gradientColors: [theme.colors.primary, theme.colors.secondary],
  });
  
  const [showLogo, setShowLogo] = useState(false);
  
  const handleSave = () => {
    if (onSave) {
      onSave(qrOptions);
    } else {
      navigation.goBack();
    }
  };
  
  const qrValue = businessCardToPayload(businessCard);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.error }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Customize QR Code
        </Text>
        
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleSave}
          accessibilityLabel="Save"
          accessibilityRole="button"
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.primary }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.qrPreview, { backgroundColor: theme.colors.card }]}>
          <QRCode
            value={qrValue}
            size={200}
            color={qrOptions.enableGradient ? undefined : qrOptions.color}
            backgroundColor={qrOptions.backgroundColor}
            logo={showLogo ? require('../../assets/icon.png') : undefined}
            logoSize={showLogo ? 50 : undefined}
            logoBackgroundColor="white"
            logoBorderRadius={10}
            quietZone={10}
            enableLinearGradient={qrOptions.enableGradient}
            linearGradient={qrOptions.gradientColors}
            gradientDirection={['0', '0', '1', '1']}
            ecl={qrOptions.errorCorrectionLevel}
          />
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            QR Code Color
          </Text>
          
          <ColorPicker
            color={qrOptions.color}
            onColorChange={(color) => setQROptions({ ...qrOptions, color })}
            presetColors={[
              '#000000', // Black
              '#1877F2', // Facebook blue
              '#6D28D9', // Purple
              '#10B981', // Green
              '#F97316', // Orange
              '#EF4444', // Red
              '#0EA5E9', // Light blue
              '#8B5CF6', // Violet
            ]}
          />
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Background Color
          </Text>
          
          <ColorPicker
            color={qrOptions.backgroundColor}
            onColorChange={(color) => setQROptions({ ...qrOptions, backgroundColor: color })}
            presetColors={[
              '#FFFFFF', // White
              '#F9FAFB', // Off-white
              '#F3F4F6', // Light gray
              '#E5E7EB', // Gray
              '#ECFDF5', // Light green
              '#EFF6FF', // Light blue
              '#FEF3C7', // Light yellow
              '#FCE7F3', // Light pink
            ]}
          />
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Advanced Options
          </Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              Use Gradient
            </Text>
            <Switch
              value={qrOptions.enableGradient}
              onValueChange={(value) => setQROptions({ ...qrOptions, enableGradient: value })}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          {qrOptions.enableGradient && (
            <View style={styles.gradientSection}>
              <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>
                Gradient Colors
              </Text>
              
              <Text style={[styles.colorLabel, { color: theme.colors.textSecondary }]}>
                Start Color
              </Text>
              <ColorPicker
                color={qrOptions.gradientColors?.[0] || theme.colors.primary}
                onColorChange={(color) => setQROptions({ 
                  ...qrOptions, 
                  gradientColors: [color, qrOptions.gradientColors?.[1] || theme.colors.secondary] 
                })}
                presetColors={[
                  '#1877F2', // Facebook blue
                  '#6D28D9', // Purple
                  '#10B981', // Green
                  '#F97316', // Orange
                  '#EF4444', // Red
                  '#0EA5E9', // Light blue
                  '#8B5CF6', // Violet
                  '#000000', // Black
                ]}
              />
              
              <Text style={[styles.colorLabel, { color: theme.colors.textSecondary }]}>
                End Color
              </Text>
              <ColorPicker
                color={qrOptions.gradientColors?.[1] || theme.colors.secondary}
                onColorChange={(color) => setQROptions({ 
                  ...qrOptions, 
                  gradientColors: [qrOptions.gradientColors?.[0] || theme.colors.primary, color] 
                })}
                presetColors={[
                  '#166FE5', // Darker Facebook blue
                  '#4C1D95', // Dark purple
                  '#047857', // Dark green
                  '#C2410C', // Dark orange
                  '#B91C1C', // Dark red
                  '#0369A1', // Dark light blue
                  '#6D28D9', // Dark violet
                  '#4B5563', // Dark gray
                ]}
              />
            </View>
          )}
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              Add Logo
            </Text>
            <Switch
              value={showLogo}
              onValueChange={setShowLogo}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              Error Correction
            </Text>
            <View style={styles.segmentedControl}>
              {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.segmentButton,
                    qrOptions.errorCorrectionLevel === level && { 
                      backgroundColor: theme.colors.primary 
                    }
                  ]}
                  onPress={() => setQROptions({ ...qrOptions, errorCorrectionLevel: level })}
                >
                  <Text style={[
                    styles.segmentButtonText,
                    qrOptions.errorCorrectionLevel === level ? { color: '#fff' } : { color: theme.colors.text }
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            Higher error correction levels (L→H) make the QR code more reliable but also more complex.
          </Text>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  qrPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLabel: {
    fontSize: 16,
  },
  gradientSection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  colorLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default QRCustomizationScreen;