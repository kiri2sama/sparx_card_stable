import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NFCReaderScreen from '../screens/NFCReaderScreen';
import NFCWriterScreen from '../screens/NFCWriterScreen';
import ContactPreviewScreen from '../screens/ContactPreviewScreen';
import SavedCardsScreen from '../screens/SavedCardsScreen';

const Stack = createStackNavigator();

export const setUpNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0066cc',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Digital Business Card' }} 
        />
        <Stack.Screen 
          name="NFCReader" 
          component={NFCReaderScreen} 
          options={{ title: 'Read NFC Card' }} 
        />
        <Stack.Screen 
          name="NFCWriter" 
          component={NFCWriterScreen} 
          options={({ route }) => ({ 
            title: route.params?.editMode ? 'Edit Business Card' : 'Create NFC Card'
          })} 
        />
        <Stack.Screen 
          name="ContactPreview" 
          component={ContactPreviewScreen} 
          options={{ title: 'Contact Details' }} 
        />
        <Stack.Screen 
          name="SavedCards" 
          component={SavedCardsScreen} 
          options={{ title: 'Saved Business Cards' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};