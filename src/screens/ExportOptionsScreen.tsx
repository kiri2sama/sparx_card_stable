import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { BusinessCard } from '../types/businessCard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

type ExportOptionsParams = {
  businessCards: BusinessCard[];
  singleCard?: boolean;
};

interface ExportFormat {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const ExportOptionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  
  const { businessCards, singleCard } = route.params as ExportOptionsParams || { businessCards: [] };
  const [isExporting, setIsExporting] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<string | null>(null);
  
  const exportFormats: ExportFormat[] = [
    {
      id: 'vcf',
      name: 'vCard (.vcf)',
      icon: 'card-outline',
      description: 'Standard format for contact information, compatible with most contact apps.'
    },
    {
      id: 'csv',
      name: 'CSV Spreadsheet',
      icon: 'grid-outline',
      description: 'Export contacts as a spreadsheet that can be opened in Excel or Google Sheets.'
    },
    {
      id: 'json',
      name: 'JSON',
      icon: 'code-slash-outline',
      description: 'Export contacts as structured data for developers or data import.'
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      icon: 'document-text-outline',
      description: 'Create a printable document with all contact information.'
    },
    {
      id: 'crm',
      name: 'CRM Integration',
      icon: 'people-circle-outline',
      description: 'Export directly to popular CRM systems like Salesforce or HubSpot.'
    }
  ];
  
  const handleExport = async (format: string) => {
    setIsExporting(true);
    setCurrentFormat(format);
    
    try {
      switch (format) {
        case 'vcf':
          await exportToVCF();
          break;
        case 'csv':
          await exportToCSV();
          break;
        case 'json':
          await exportToJSON();
          break;
        case 'pdf':
          await exportToPDF();
          break;
        case 'crm':
          await exportToCRM();
          break;
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
      Alert.alert('Export Failed', `Failed to export as ${format}. Please try again.`);
    } finally {
      setIsExporting(false);
      setCurrentFormat(null);
    }
  };
  
  const exportToVCF = async () => {
    // Generate vCard content
    let vcardContent = '';
    
    businessCards.forEach(card => {
      vcardContent += 'BEGIN:VCARD\r\n';
      vcardContent += 'VERSION:3.0\r\n';
      vcardContent += `FN:${card.name}\r\n`;
      
      if (card.title) {
        vcardContent += `TITLE:${card.title}\r\n`;
      }
      
      if (card.company) {
        vcardContent += `ORG:${card.company}\r\n`;
      }
      
      if (card.phone) {
        vcardContent += `TEL;TYPE=CELL:${card.phone}\r\n`;
      }
      
      if (card.additionalPhones && card.additionalPhones.length > 0) {
        card.additionalPhones.forEach(phone => {
          vcardContent += `TEL;TYPE=WORK:${phone}\r\n`;
        });
      }
      
      if (card.email) {
        vcardContent += `EMAIL:${card.email}\r\n`;
      }
      
      if (card.additionalEmails && card.additionalEmails.length > 0) {
        card.additionalEmails.forEach(email => {
          vcardContent += `EMAIL:${email}\r\n`;
        });
      }
      
      if (card.website) {
        vcardContent += `URL:${card.website}\r\n`;
      }
      
      if (card.additionalWebsites && card.additionalWebsites.length > 0) {
        card.additionalWebsites.forEach(website => {
          vcardContent += `URL:${website}\r\n`;
        });
      }
      
      if (card.socialProfiles) {
        Object.entries(card.socialProfiles).forEach(([platform, url]) => {
          vcardContent += `URL;TYPE=${platform.toUpperCase()}:${url}\r\n`;
        });
      }
      
      if (card.notes) {
        vcardContent += `NOTE:${card.notes}\r\n`;
      }
      
      vcardContent += 'END:VCARD\r\n\r\n';
    });
    
    // Save to file
    const fileName = singleCard 
      ? `${businessCards[0].name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.vcf`
      : 'contacts.vcf';
    
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, vcardContent);
    
    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/vcard',
        dialogTitle: 'Export Contacts',
      });
    } else {
      Alert.alert('Sharing not available', 'Sharing is not available on this device');
    }
  };
  
  const exportToCSV = async () => {
    // Generate CSV content
    let csvContent = 'Name,Title,Company,Phone,Email,Website,Notes\r\n';
    
    businessCards.forEach(card => {
      const fields = [
        card.name,
        card.title,
        card.company,
        card.phone,
        card.email,
        card.website,
        card.notes
      ].map(field => {
        // Escape quotes and wrap in quotes
        if (field) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return '';
      });
      
      csvContent += fields.join(',') + '\r\n';
    });
    
    // Save to file
    const fileName = singleCard 
      ? `${businessCards[0].name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`
      : 'contacts.csv';
    
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, csvContent);
    
    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Contacts',
      });
    } else {
      Alert.alert('Sharing not available', 'Sharing is not available on this device');
    }
  };
  
  const exportToJSON = async () => {
    // Generate JSON content
    const jsonContent = JSON.stringify(businessCards, null, 2);
    
    // Save to file
    const fileName = singleCard 
      ? `${businessCards[0].name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
      : 'contacts.json';
    
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, jsonContent);
    
    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Export Contacts',
      });
    } else {
      Alert.alert('Sharing not available', 'Sharing is not available on this device');
    }
  };
  
  const exportToPDF = async () => {
    // In a real app, this would generate a PDF file
    // For now, we'll just show a message
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
    Alert.alert(
      'Feature Coming Soon',
      'PDF export will be available in a future update.',
      [{ text: 'OK' }]
    );
  };
  
  const exportToCRM = async () => {
    // In a real app, this would integrate with CRM systems
    // For now, we'll just show a message
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
    Alert.alert(
      'Feature Coming Soon',
      'CRM integration will be available in a future update.',
      [{ text: 'OK' }]
    );
  };
  
  const renderExportOption = (format: ExportFormat) => (
    <TouchableOpacity
      key={format.id}
      style={[styles.exportOption, { backgroundColor: theme.colors.card }]}
      onPress={() => handleExport(format.id)}
      disabled={isExporting}
      accessibilityLabel={`Export as ${format.name}`}
      accessibilityRole="button"
    >
      <View style={styles.exportOptionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name={format.icon as any} size={24} color={theme.colors.primary} />
        </View>
        
        <View style={styles.exportOptionInfo}>
          <Text style={[styles.exportOptionTitle, { color: theme.colors.text }]}>
            {format.name}
          </Text>
          <Text style={[styles.exportOptionDescription, { color: theme.colors.textSecondary }]}>
            {format.description}
          </Text>
        </View>
        
        {isExporting && currentFormat === format.id ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Export Options
        </Text>
        
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            {singleCard 
              ? `Export ${businessCards[0]?.name}'s Card` 
              : `Export ${businessCards.length} Contacts`}
          </Text>
          
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Choose a format to export your {singleCard ? 'contact' : 'contacts'}:
          </Text>
        </View>
        
        <View style={styles.exportOptions}>
          {exportFormats.map(renderExportOption)}
        </View>
        
        <View style={[styles.importSection, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.importTitle, { color: theme.colors.text }]}>
            Import Contacts
          </Text>
          
          <Text style={[styles.importDescription, { color: theme.colors.textSecondary }]}>
            You can also import contacts from external files.
          </Text>
          
          <TouchableOpacity
            style={[styles.importButton, { backgroundColor: theme.colors.primary }]}
            onPress={async () => {
              try {
                // In a real app, this would handle file import
                const result = await DocumentPicker.getDocumentAsync({
                  type: ['text/vcard', 'text/csv', 'application/json'],
                  copyToCacheDirectory: true,
                });
                
                if (result.canceled) {
                  return;
                }
                
                Alert.alert(
                  'Feature Coming Soon',
                  'Contact import will be available in a future update.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                console.error('Error picking document:', error);
                Alert.alert('Error', 'Failed to pick document');
              }
            }}
            accessibilityLabel="Import contacts"
            accessibilityRole="button"
          >
            <Ionicons name="download-outline" size={20} color="#fff" style={styles.importButtonIcon} />
            <Text style={styles.importButtonText}>Import Contacts</Text>
          </TouchableOpacity>
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
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
  },
  exportOptions: {
    marginBottom: 24,
  },
  exportOption: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exportOptionInfo: {
    flex: 1,
  },
  exportOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exportOptionDescription: {
    fontSize: 14,
  },
  importSection: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  importTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  importDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  importButtonIcon: {
    marginRight: 8,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ExportOptionsScreen;