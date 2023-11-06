import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useAppState } from '../../../AppContext'
import { globalStyles } from '../../utils/Constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { config } from '../../utils/Config';

const Splash = () => {

  const navigation = useNavigation();
  const props = useAppState();

  useEffect(() => {
    setTimeout(async () => {
      const username = await AsyncStorage.getItem('SimpleChatUsername');
      if (username) {
        const user = (await axios.get(`${config.api.data.single}/single?table=SimpleChat-Users&id=${username}`)).data.Item;
        props?.setUser(user);
        navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Auth' as never }] });
      }
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Splash