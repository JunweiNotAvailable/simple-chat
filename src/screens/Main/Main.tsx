import { View, Image, Platform, StyleSheet, AppState } from 'react-native'
import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Chat from './Chat/Chat';
import { UserProps, urls } from '../../utils/Constants';
import Profile from './Profile/Profile';
import { useAppState } from '../../../AppContext';
import axios from 'axios';
import { config } from '../../utils/Config';

const Tab = createBottomTabNavigator();

const Main = () => {

  const props = useAppState();

  useEffect(() => {
    (async () => {
      if (AppState.currentState === 'active' && props?.user) {
        const updateUser: UserProps = { ...props.user, lastOnlineTime: new Date().toISOString() };
        await axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Users', data: updateUser });
      }
    })();
    const updateInterval = setInterval(async () => {
      // Update the last timestamp if it's active
      if (AppState.currentState === 'active' && props?.user) {
        const updateUser: UserProps = { ...props.user, lastOnlineTime: new Date().toISOString() };
        await axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Users', data: updateUser });
      }
    }, 300000); // 5 minutes
  
    // Clean up the interval when the component unmounts
    return () => clearInterval(updateInterval);
  }, []);

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        borderTopWidth: 0,
      },
      tabBarHideOnKeyboard: Platform.OS === 'android',
    }}>
      {/* chat */}
      <Tab.Screen
        name='Chat'
        component={Chat} options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconStyle}>
              <Image style={styles.imageStyle} source={focused ? urls.chatColored : urls.chat}/>
            </View>
          )
        }}
      />
      {/* docs */}
      {/* profile */}
      <Tab.Screen
        name='Profile'
        component={Profile} options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconStyle}>
              <Image style={styles.imageStyle} source={focused ? urls.userColored : urls.user}/>
            </View>
          )
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  iconStyle: {
    width: '48%',
    height: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: '100%',
    aspectRatio: '1/1'
  }
});

export default Main