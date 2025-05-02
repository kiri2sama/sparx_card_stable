import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import NFCReaderScreen from './screens/NFCReaderScreen';
import NFCWriterScreen from './screens/NFCWriterScreen';
import CardViewScreen from './screens/CardViewScreen';
import SavedCardsScreen from './screens/SavedCardsScreen';
import QRReaderScreen from './screens/QRReaderScreen';
import ImportOptionsScreen from './screens/ImportOptionsScreen';
import ContactPreviewScreen from './screens/ContactPreviewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
};

const SavedCardsStack = () => {
  return (
    <Stack.Navigator>
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

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Saved') {
              iconName = focused ? 'card' : 'card-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066cc',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 20,
            borderRadius: 20,
            height: 70,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 8,
          },
          tabBarItemStyle: {
            borderRadius: 16,
            marginHorizontal: 8,
            marginVertical: 8,
          },
        })}
        sceneContainerStyle={{ backgroundColor: 'transparent' }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Saved" component={SavedCardsStack} />
        <Tab.Screen name="Profile" component={require('./screens/ProfileScreen').default} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;