import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStateProvider } from './ProfileContext';
import Overflow from './Overview';
import Settings from './Settings';
import EditProfile from './EditProfile';

const Stack = createNativeStackNavigator();

const Profile = () => {
  return (
    <ProfileStateProvider>
      <Stack.Navigator initialRouteName='Overview' screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name='Overview' component={Overflow}/>
        <Stack.Screen name='EditProfile' component={EditProfile} options={{
          presentation: 'formSheet',
        }}/>
        <Stack.Screen name='Settings' component={Settings} options={{
          presentation: 'formSheet',
        }}/>
      </Stack.Navigator>
    </ProfileStateProvider>
  )
}

export default Profile