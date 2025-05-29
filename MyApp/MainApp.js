import React, { useContext } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsScreen from './screens/chatsScreen';
import UsersScreen from './screens/usersScreen';
import ProfileScreen from './screens/profileScreen';
import ChatViewScreen from './screens/chatViewScreen';
import LoginScreen from './screens/LoginScreen';
import RegScreen from './screens/RegScreen';

import { StatusBar } from 'expo-status-bar';
import { UserContext } from './context/userData';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const API_URL = "http://localhost:3000/"
export const WS_URL = "ws://localhost:3000/"

export default function MainApp() {
  const { userData, isLogged } = useContext(UserContext);

  const Tabs = () => (
    <Tab.Navigator>
      {isLogged ? (
        <>
          <Tab.Screen name="Чаты" component={ChatsScreen} />
          <Tab.Screen name="Пользователи" component={UsersScreen} />
          <Tab.Screen name="Профиль" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Авторизация" component={LoginScreen} />
          <Tab.Screen name="Регистрация" component={RegScreen} />
        </>
      )}
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={Tabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChatView" 
          component={ChatViewScreen} 
          options={({ route }) => ({ title: route.params?.chatName || 'Чат' })} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

