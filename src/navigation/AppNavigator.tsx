import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateItemScreen } from '../screens/CreateItemScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ChatScreen } from '../screens/ChatScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CreateItem: undefined;
  Profile: undefined;
  Chat: { chatId?: string; recipientId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Objetos Perdidos/Encontrados' }} />
        <Stack.Screen name="CreateItem" component={CreateItemScreen} options={{ title: 'Publicar Objeto' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi Perfil' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Mensajes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
