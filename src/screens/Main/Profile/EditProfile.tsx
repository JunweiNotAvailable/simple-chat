import { TextInput, TouchableWithoutFeedback, Keyboard, View, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView, Text } from 'react-native'
import React, { useState } from 'react'
import { useAppState } from '../../../../AppContext'
import { useProfileState } from './ProfileContext'
import { UserProps, globalStyles } from '../../../utils/Constants'
import Button from '../../Utils/Button'
import axios from 'axios'
import { config } from '../../../utils/Config'
import Topbar from '../../Utils/Topbar'
import { useNavigation } from '@react-navigation/native'

const EditProfile = () => {

  const navigation = useNavigation();
  const props = { ...useAppState(), ...useProfileState() };
  const [name, setName] = useState(props.user?.name || '');
  const [aboutMe, setAboutMe] = useState(props.user?.aboutMe || '');

  const saveProfile = async () => {
    if (name.length === 0 || !props.user) return;
    const newUser: UserProps = {
      ...props.user,
      name: name,
      aboutMe: aboutMe,
    };
    props.setUser?.(newUser);
    navigation.goBack();
    axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Users', data: newUser });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, globalStyles.safeArea]}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'android' ? undefined : 'padding'}>
          {Platform.OS === 'android' && <Topbar back title='編輯個人資訊'/>}
          <View style={{ marginTop: 12 }}/>
          <View style={styles.body}>
            <Text style={styles.label}>用戶名稱</Text>
            <TextInput placeholder='用戶名稱' value={name} onChangeText={text => setName(text)} style={styles.input}/>
            <Text style={styles.label}>關於我</Text>
            <TextInput placeholder='關於我' multiline value={aboutMe} onChangeText={text => setAboutMe(text)} style={styles.textarea}/>
            <Button text='儲存' style={name.length === 0 ? styles.saveButtonDisabled : styles.saveButton} textStyle={styles.saveButtonText} onPress={saveProfile}/>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  body: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
  },
  textarea: {
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    minHeight: 50,
    maxHeight: 140,
  },
  saveButtonDisabled: {
    marginTop: 16,
    borderRadius: 10,
    padding: 10,
    backgroundColor: globalStyles.colors.primaryDisabled,
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 10,
    padding: 10,
    backgroundColor: globalStyles.colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditProfile