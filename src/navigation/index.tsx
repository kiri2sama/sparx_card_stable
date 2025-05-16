import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import GradientHeader from '../components/GradientHeader';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import NFCReaderScreen from '../screens/NFCReaderScreen';
import NFCWriterScreen from '../screens/NFCWriterScreen';
import AdvancedNFCWriterScreen from '../screens/AdvancedNFCWriterScreen';
import QRReaderScreen from '../screens/QRReaderScreen';
import CardViewScreen from '../screens/CardViewScreen';
import ImportOptionsScreen from '../screens/ImportOptionsScreen';
import ContactPreviewScreen from '../screens/ContactPreviewScreen';
import TemplateGalleryScreen from '../screens/TemplateGalleryScreen';
import SavedCardsScreen from '../screens/SavedCardsScreen';
import ScanOptionsScreen from '../screens/ScanOptionsScreen';
import LeadsScreen from '../screens/LeadsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ThemeSettingsScreen from '../screens/ThemeSettingsScreen';
import LanguageSettingsScreen from '../screens/LanguageSettingsScreen';
import BackupRestoreScreen from '../screens/BackupRestoreScreen';
import LandingScreen from '../screens/LandingScreen';
import CardManagementScreen from '../screens/CardManagementScreen';
import DatabaseConfigScreen from '../screens/DatabaseConfigScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
const HomeStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          borderBottomWidth: 0,
          height: 100, // Taller header
        },
        headerTintColor: '#FFFFFF', // White text for better contrast
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 20,
          letterSpacing: 0.5,
        },
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ 
          title: 'SparX Card',
          header: (props) => <GradientHeader title="SparX Card" showBackButton={false} />
        }} 
      />
      <Stack.Screen 
        name="Landing" 
        component={LandingScreen} 
        options={{ 
          title: 'SparX Card',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="CardManagement" 
        component={CardManagementScreen} 
        options={{ 
          title: 'Card Management',
          header: (props) => <GradientHeader title="Card Management" />
        }} 
      />
      <Stack.Screen 
        name="NFCReader" 
        component={NFCReaderScreen} 
        options={{ 
          title: 'Read NFC Card',
          header: (props) => <GradientHeader title="Read NFC Card" />
        }} 
      />
      <Stack.Screen 
        name="QRReader" 
        component={QRReaderScreen} 
        options={{ 
          title: 'Scan QR Code',
          header: (props) => <GradientHeader title="Scan QR Code" />
        }} 
      />
      <Stack.Screen 
        name="NFCWriter" 
        component={NFCWriterScreen} 
        options={{ 
          title: 'Write NFC Card',
          header: (props) => <GradientHeader title="Write NFC Card" />
        }} 
      />
      <Stack.Screen 
        name="AdvancedNFCWriter" 
        component={AdvancedNFCWriterScreen} 
        options={{ 
          title: 'Advanced NFC Writer',
          header: (props) => <GradientHeader title="Advanced NFC Writer" />
        }} 
      />
      <Stack.Screen 
        name="CardView" 
        component={CardViewScreen} 
        options={{ 
          title: 'Business Card Details',
          header: (props) => <GradientHeader title="Business Card Details" />
        }} 
      />
      <Stack.Screen 
        name="ImportOptions" 
        component={ImportOptionsScreen} 
        options={{ 
          title: 'Import Business Card',
          header: (props) => <GradientHeader title="Import Business Card" />
        }} 
      />
      <Stack.Screen 
        name="ContactPreview" 
        component={ContactPreviewScreen} 
        options={{ 
          title: 'Contact Preview',
          header: (props) => <GradientHeader title="Contact Preview" />
        }} 
      />
      <Stack.Screen 
        name="TemplateGallery" 
        component={TemplateGalleryScreen} 
        options={{ 
          title: 'Card Templates',
          header: (props) => <GradientHeader title="Card Templates" />
        }} 
      />
    </Stack.Navigator>
  );
};

// Cards Stack
const CardsStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          borderBottomWidth: 0,
          height: 100, // Taller header
        },
        headerTintColor: '#FFFFFF', // White text for better contrast
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 20,
          letterSpacing: 0.5,
        },
      }}
    >
      <Stack.Screen 
        name="SavedCards" 
        component={SavedCardsScreen} 
        options={{ 
          title: 'My Cards',
          header: (props) => <GradientHeader title="My Cards" showBackButton={false} />
        }} 
      />
      <Stack.Screen 
        name="CardView" 
        component={CardViewScreen} 
        options={{ 
          title: 'Business Card Details',
          header: (props) => <GradientHeader title="Business Card Details" />
        }} 
      />
      <Stack.Screen 
        name="TemplateGallery" 
        component={TemplateGalleryScreen} 
        options={{ 
          title: 'Card Templates',
          header: (props) => <GradientHeader title="Card Templates" />
        }} 
      />
    </Stack.Navigator>
  );
};

// Scan Stack (Central Tab)
const ScanStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          borderBottomWidth: 0,
          height: 100, // Taller header
        },
        headerTintColor: '#FFFFFF', // White text for better contrast
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 20,
          letterSpacing: 0.5,
        },
      }}
    >
      <Stack.Screen 
        name="ScanOptions" 
        component={ScanOptionsScreen} 
        options={{ 
          title: 'Scan',
          header: (props) => <GradientHeader title="Scan" showBackButton={false} />
        }} 
      />
      <Stack.Screen 
        name="NFCReader" 
        component={NFCReaderScreen} 
        options={{ 
          title: 'Read NFC Card',
          header: (props) => <GradientHeader title="Read NFC Card" />
        }} 
      />
      <Stack.Screen 
        name="QRReader" 
        component={QRReaderScreen} 
        options={{ 
          title: 'Scan QR Code',
          header: (props) => <GradientHeader title="Scan QR Code" />
        }} 
      />
      <Stack.Screen 
        name="NFCWriter" 
        component={NFCWriterScreen} 
        options={{ 
          title: 'Write NFC Card',
          header: (props) => <GradientHeader title="Write NFC Card" />
        }} 
      />
      <Stack.Screen 
        name="AdvancedNFCWriter" 
        component={AdvancedNFCWriterScreen} 
        options={{ 
          title: 'Advanced NFC Writer',
          header: (props) => <GradientHeader title="Advanced NFC Writer" />
        }} 
      />
      <Stack.Screen 
        name="CardView" 
        component={CardViewScreen} 
        options={{ 
          title: 'Business Card Details',
          header: (props) => <GradientHeader title="Business Card Details" />
        }} 
      />
    </Stack.Navigator>
  );
};

// Leads Stack
const LeadsStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          borderBottomWidth: 0,
          height: 100, // Taller header
        },
        headerTintColor: '#FFFFFF', // White text for better contrast
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 20,
          letterSpacing: 0.5,
        },
      }}
    >
      <Stack.Screen 
        name="LeadsList" 
        component={LeadsScreen} 
        options={{ 
          title: 'Leads',
          header: (props) => <GradientHeader title="Leads" showBackButton={false} />
        }} 
      />
      <Stack.Screen 
        name="CardView" 
        component={CardViewScreen} 
        options={{ 
          title: 'Contact Details',
          header: (props) => <GradientHeader title="Contact Details" />
        }} 
      />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          borderBottomWidth: 0,
          height: 100, // Taller header
        },
        headerTintColor: '#FFFFFF', // White text for better contrast
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 20,
          letterSpacing: 0.5,
        },
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          header: (props) => <GradientHeader title="Profile" showBackButton={false} />
        }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Settings',
          header: (props) => <GradientHeader title="Settings" />
        }} 
      />
      <Stack.Screen 
        name="ThemeSettings" 
        component={ThemeSettingsScreen} 
        options={{ 
          title: 'Theme',
          header: (props) => <GradientHeader title="Theme" />
        }} 
      />
      <Stack.Screen 
        name="LanguageSettings" 
        component={LanguageSettingsScreen} 
        options={{ 
          title: 'Language',
          header: (props) => <GradientHeader title="Language" />
        }} 
      />
      <Stack.Screen 
        name="BackupRestore" 
        component={BackupRestoreScreen} 
        options={{ 
          title: 'Backup & Restore',
          header: (props) => <GradientHeader title="Backup & Restore" />
        }} 
      />
      <Stack.Screen 
        name="DatabaseConfig" 
        component={DatabaseConfigScreen} 
        options={{ 
          title: 'Database Configuration',
          header: (props) => <GradientHeader title="Database Configuration" />
        }} 
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'planet' : 'planet-outline';
          } else if (route.name === 'Cards') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Scan') {
            iconName = focused ? 'scan-circle' : 'scan-circle-outline';
          } else if (route.name === 'Leads') {
            iconName = focused ? 'people-circle' : 'people-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
        tabBarShowLabel: false, // Hide the tab bar labels
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 20,
          borderRadius: 20,
          height: 70,
          backgroundColor: theme.colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
          marginVertical: 8,
        },
      })}
      sceneContainerStyle={{ backgroundColor: theme.colors.background }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Cards" component={CardsStack} />
      <Tab.Screen 
        name="Scan" 
        component={ScanStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 30,
              padding: 14,
              marginBottom: 20,
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.7,
              shadowRadius: 6,
              elevation: 8,
              borderWidth: 3,
              borderColor: '#FFFFFF',
            }}>
              <Ionicons 
                name="add-circle"
                size={26} 
                color="#FFFFFF"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Leads" component={LeadsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabs;