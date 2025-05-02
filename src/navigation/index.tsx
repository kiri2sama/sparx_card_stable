import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NFCReaderScreen from '../screens/NFCReaderScreen';
import NFCWriterScreen from '../screens/NFCWriterScreen';
import ContactPreviewScreen from '../screens/ContactPreviewScreen';
import SavedCardsScreen from '../screens/SavedCardsScreen';
//import WriteOptionsScreen from '../screens/WriteOptionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NFCReader" component={NFCReaderScreen} />
      <Stack.Screen name="NFCWriter" component={NFCWriterScreen} />
      <Stack.Screen name="ContactPreview" component={ContactPreviewScreen} />
      <Stack.Screen name="SavedCards" component={SavedCardsScreen} />
    {/* <Stack.Screen name="WriteOptions" component={WriteOptionsScreen} /> */}
    </Stack.Navigator>
  );
}

export const setUpNavigation = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 24,
          elevation: 8,
          backgroundColor: '#232526',
          borderRadius: 24,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#38ef7d',
        tabBarInactiveTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Main"
        component={MainStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedCardsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);