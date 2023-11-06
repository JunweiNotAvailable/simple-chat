import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../utils/Constants';
import Button from '../Utils/Button';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppState } from '../../../AppContext';
import axios from 'axios';
import { config } from '../../utils/Config';
import Loading from '../Utils/Loading';

const SignIn = () => {

  const props = useAppState();
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (loading || !username.length || !password.length) return;
    setLoading(true);
    const cognitoUser = await Auth.signIn(username, password);
    const user = (await axios.get(`${config.api.data.single}/single?table=SimpleChat-Users&id=${cognitoUser.username}`)).data.Item;
    props?.setUser(user);
    await AsyncStorage.setItem('SimpleChatUsername', username);
    navigation.reset({ index: 0, routes: [{ name: 'Main' as never }] });
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={FormStyles.container}>
        <Text style={FormStyles.title}>登入</Text>
        <TextInput placeholder='Email或用戶名稱' value={username} style={[FormStyles.input]} onChangeText={text => setUsername(text)}/>
        <TextInput placeholder='密碼' value={password} style={[FormStyles.input]} secureTextEntry onChangeText={text => setPassword(text)}/>
        <Button onPress={signIn} icon={loading ? <Loading small color={'#fff'}/> : <View>
          <Text style={FormStyles.buttonText}>登入</Text>
        </View>} style={{ ...FormStyles.submitButton, backgroundColor: !loading && username.length > 0 && password.length > 0 ? globalStyles.colors.primary : globalStyles.colors.primaryDisabled }}/>
        <Button onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'SignUp' as never }]
        })} icon={<View>
          <Text style={FormStyles.reverseButtonText}>註冊</Text>
        </View>} style={FormStyles.reverseButton}/>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export const FormStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    padding: 8,
    fontWeight: 'bold',
    width: '60%',
  },
  input: {
    width: '60%',
    marginTop: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
  },
  submitButton: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 12,
    padding: 8,
    backgroundColor: globalStyles.colors.primary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reverseButton: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 12,
    padding: 8,
  },
  reverseButtonText: {
    color: globalStyles.colors.primary,
    fontWeight: 'bold',
  },
});

export default SignIn