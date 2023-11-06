import { View, Text } from 'react-native'
import React from 'react'
import { ChatStateProvider } from './ChatContext'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatRooms from './ChatRooms';
import Search from './Search';
import ChatRoom from './ChatRoom';

const Stack = createNativeStackNavigator();

const Chat = () => {
  return (
    <ChatStateProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='ChatRooms'>
        <Stack.Screen name='ChatRooms' component={ChatRooms}/>
        <Stack.Screen name='ChatRoom' component={ChatRoom}/>
        <Stack.Screen name='Search' component={Search}/>
      </Stack.Navigator>
    </ChatStateProvider>
  )
}

export default Chat