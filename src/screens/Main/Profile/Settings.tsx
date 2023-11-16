import { Pressable, ScrollView, SafeAreaView, Platform, StyleSheet, View, Text } from 'react-native'
import React from 'react'
import Topbar from '../../Utils/Topbar'
import { globalStyles } from '../../../utils/Constants'
import Button from '../../Utils/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useAppState } from '../../../../AppContext'
import { useProfileState } from './ProfileContext'

const Settings = () => {

  const props = { ...useAppState(), ...useProfileState() };
  const navigation = useNavigation();

  const signOut = async () => {
    await AsyncStorage.removeItem('SimpleChatUsername');
    navigation.reset({ index: 0, routes: [{ name: 'Auth' as never }] });
    props.setUser?.(null);
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.safeArea]}>
      {Platform.OS === 'android' && <Topbar back title='更多選項'/>}
      <View style={{ marginTop: 12 }}/>
      <Button text={'帳號'} style={styles.button} textStyle={styles.buttonText} onPress={() => {}}/>
      <Button text={'登出'} style={styles.button} textStyle={styles.buttonText} onPress={signOut}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings