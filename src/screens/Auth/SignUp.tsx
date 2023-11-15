import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../../utils/Constants';
import Button from '../Utils/Button';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify'
import Loading from '../Utils/Loading';

const SignUp = () => {

  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = () => {
    return username.length > 0 &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) &&
      password.length >= 6 &&
      password2 === password &&
      !loading;
  }

  const signUp = async () => {
    if (!isValid()) return;
    setLoading(true);
    try {
      await Auth.signUp({
        username: username,
        password: password,
        attributes: {
          email: email
        }
      });
      navigation.reset({ index: 0, routes: [{ name: 'Confirm' as never, params: { username: username, name: name } }] });
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        setErrorMessage('用戶名稱已被使用');
      }
      console.log(error)
    }
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={FormStyles.container}>
        <Text style={FormStyles.title}>註冊</Text>
        {errorMessage && <Text style={FormStyles.errorMessage}>{errorMessage}</Text>}
        <TextInput placeholder='ID' value={username} style={[FormStyles.input]} onChangeText={text => setUsername(text)}/>
        <TextInput placeholder='用戶名稱' value={name} style={[FormStyles.input]} onChangeText={text => setname(text)}/>
        <TextInput placeholder='Email' value={email} style={[FormStyles.input]} onChangeText={text => setEmail(text)}/>
        <TextInput placeholder='密碼' value={password} style={[FormStyles.input]} secureTextEntry onChangeText={text => setPassword(text)}/>
        <TextInput placeholder='確認密碼' value={password2} style={[FormStyles.input]} secureTextEntry onChangeText={text => setPassword2(text)}/>
        <Button onPress={signUp} icon={loading ? <Loading small color={'#fff'}/> : <View>
          <Text style={FormStyles.buttonText}>註冊</Text>
        </View>} style={{ ...FormStyles.submitButton, backgroundColor: isValid() ? globalStyles.colors.primary : globalStyles.colors.primaryDisabled }}/>
        <Button onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' as never }]
          })
        }} icon={<View>
          <Text style={FormStyles.reverseButtonText}>登入</Text>
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
  errorMessage: {
    color: globalStyles.colors.error,
    margin: 4,
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

export default SignUp