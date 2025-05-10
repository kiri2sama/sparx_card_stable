import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import NFCReaderScreen from '../screens/NFCReaderScreen';
import NFCWriterScreen from '../screens/NFCWriterScreen';
import QRReaderScreen from '../screens/QRReaderScreen';
import CardViewScreen from '../screens/CardViewScreen';
import CardEditorScreen from '../screens/CardEditorScreen';
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
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ShareOptionsScreen from '../screens/ShareOptionsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ContactManagementScreen from '../screens/ContactManagementScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
const HomeStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ title: 'SparX Card' }} 
      />
      <Stack.Screen 
        name="NFCReader" 
        component={NFCReaderScreen} 
        options={{ title: 'Read NFC Card' }} 
      />
      <Stack.Screen 
        name="QRReader" 
        component={QRReaderScreen} 
        options={{ title: 'Scan QR Code' }} 
      />
      <Stack.Screen 
        name="NFCWriter" 
        component={NFCWriterScreen} 
        options={{ title: 'Write NFC Card' }} 
      />
      <Stack.Screen 
        name="CardEditor" 
        component={CardEditorScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CardView" 
        component={CardViewScreen} 
        options={{ title: 'Business Card Details' }} 
      />
      <Stack.Screen 
        name="ImportOptions" 
        component={ImportOptionsScreen} 
        options={{ title: 'Import Business Card' }} 
      />
      <Stack.Screen 
        name="ContactPreview" 
        component={ContactPreviewScreen} 
        options={{ title: 'Contact Preview' }} 
      />
      <Stack.Screen 
        name="TemplateGallery" 
        component={TemplateGalleryScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ShareOptions" 
        component={ShareOptionsScreen} 
        options={{ headerShown: false }} 
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
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SavedCards" 
        component={SavedCardsScreen} 
        options={{ title: 'My Cards' }} 
      />
      <Stack.Screen 
        name="CardView" 
        component={CardViewScreen} 
        options={{ title: 'Business Card Details' }} 
      />
      <Stack.Screen 
        name="CardEditor" 
        component={CardEditorScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="TemplateGallery" 
        component={TemplateGalleryScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ShareOptions" 
        component={ShareOptionsScreen} 
        options={{ headerShown: false }} 
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
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ScanOptions" 
        component={ScanOptionsScreen} 
        options={{ title: 'Scan' }} 
      />
      <Stack.Screen 
        name="NFCReader" 
        component={NFCReaderScreen} 
        options={{ title: 'Read NFC Card' }} 
      />
      <Stack.Screen 
        name="QRReader" 
        component={QRReaderScreen} 
        options={{ title: 'Scan QR Code' }} 
      />
      <Stack.Screen 
        name="CardView" 
        component={CardViewScreen} 
        options={{ title: 'Business Card Details' }} 
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
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="LeadsList" 
        component={LeadsScreen} 
        options={{ title: 'Leads' }} 
      />
      <Stack.Screen 
        name="ContactManagement" 
        component={ContactManagementScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CardView" 
        component={CardViewScreen} 
        options={{ title: 'Contact Details' }} 
      />
    </Stack.Navigator>
  );
};

// Analytics Stack
const AnalyticsStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="AnalyticsDashboard" 
        component={AnalyticsScreen} 
        options={{ headerShown: false }} 
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
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
      <Stack.Screen 
        name="ThemeSettings" 
        component={ThemeSettingsScreen} 
        options={{ title: 'Theme' }} 
      />
      <Stack.Screen 
        name="LanguageSettings" 
        component={LanguageSettingsScreen} 
        options={{ title: 'Language' }} 
      />
      <Stack.Screen 
        name="BackupRestore" 
        component={BackupRestoreScreen} 
        options={{ title: 'Backup & Restore' }} 
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
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cards') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Scan') {
            iconName = focused ? 'scan-circle' : 'scan-circle-outline';
          } else if (route.name === 'Leads') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
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
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 8,
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
            <Ionicons 
              name={focused ? 'scan-circle' : 'scan-circle-outline'} 
              size={32} 
              color={theme.colors.primary} 
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: 16,
                padding: 4,
                marginBottom: -4,
              }}
            />
          ),
        }}
      />
      <Tab.Screen name="Leads" component={LeadsStack} />
      <Tab.Screen name="Analytics" component={AnalyticsStack} />
    </Tab.Navigator>
  );
};

// Root Navigator with Onboarding
const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  useEffect(() => {
    checkOnboardingStatus();
  }, []);
  
  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('hasCompletedOnboarding');
      setHasCompletedOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    // You could show a splash screen here
    return null;
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;