import { View, Image, Platform, StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Confirm from './Confirm';

const Stack = createNativeStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName='SignIn' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='SignIn' component={SignIn}/>
      <Stack.Screen name='SignUp' component={SignUp}/>
      <Stack.Screen name='Confirm' component={Confirm}/>
    </Stack.Navigator>
  )
}

export default Auth