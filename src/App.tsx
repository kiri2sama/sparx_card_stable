import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

// Screens
import HomeScreen from './screens/HomeScreen';
import NFCReaderScreen from './screens/NFCReaderScreen';
import NFCWriterScreen from './screens/NFCWriterScreen';
import CardViewScreen from './screens/CardViewScreen';
import SavedCardsScreen from './screens/SavedCardsScreen';
import QRReaderScreen from './screens/QRReaderScreen';
import ImportOptionsScreen from './screens/ImportOptionsScreen';
import ContactPreviewScreen from './screens/ContactPreviewScreen';
import ProfileScreen from './screens/ProfileScreen';
import LeadsScreen from './screens/LeadsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import TemplateGalleryScreen from './screens/TemplateGalleryScreen';

// Theme Provider
import { ThemeProvider, useTheme } from './styles/ThemeProvider';

// i18n
import './i18n';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        options={{ title: 'Scan QR Code', headerShown: true }} 
      />
      <Stack.Screen 
        name="NFCWriter" 
        component={NFCWriterScreen} 
        options={{ title: 'Write NFC Card' }} 
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
        options={{ title: 'Card Templates', headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

const SavedCardsStack = () => {
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
    </Stack.Navigator>
  );
};

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
          } else if (route.name === 'Leads') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
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
      <Tab.Screen name="Cards" component={SavedCardsStack} />
      <Tab.Screen name="Leads" component={LeadsStack} />
      <Tab.Screen name="Analytics" component={AnalyticsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background}
      />
      <PaperProvider theme={{
        ...theme,
        colors: {
          ...theme.colors,
          primary: theme.colors.primary,
          accent: theme.colors.secondary,
          background: theme.colors.background,
          surface: theme.colors.card,
          text: theme.colors.text,
          disabled: theme.colors.disabled,
          placeholder: theme.colors.placeholder,
          backdrop: 'rgba(0, 0, 0, 0.5)',
          onSurface: theme.colors.text,
          notification: theme.colors.error,
        }
      }}>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </PaperProvider>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;