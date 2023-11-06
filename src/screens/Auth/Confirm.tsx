import { View, Text, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, Keyboard } from 'react-native'
import React, { useState } from 'react'
import Button from '../Utils/Button';
import { FormStyles } from './SignUp';
import { UserProps, globalStyles } from '../../utils/Constants';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import { config } from '../../utils/Config';
import Loading from '../Utils/Loading';

type ParamList = {
  Detail: {
    username: string
  };
}

const Confirm = () => {

  const navigation = useNavigation();
  const params = useRoute<RouteProp<ParamList, 'Detail'>>().params;
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    if (code.length === 0 || loading) return;
    setLoading(true);
    try {
      // confirm sign up
      const confirmResponse = await Auth.confirmSignUp(params.username, code);
      navigation.reset({ index: 0, routes: [{ name: 'SignIn' as never }] });
      // create new user data
      const newUser: UserProps = {
        id: params.username,
        name: params.username,
        avatar: '',
        createDate: new Date().toISOString(),
        isOnline: true,
        lastOnlineTime: '',
      };
      await axios.post(`${config.api.data.single}/single`, {
        table: 'SimpleChat-Users',
        data: newUser
      });
    } catch (err) {
      setErrorMessage("驗證碼錯誤");
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={FormStyles.container}>
        <Text style={FormStyles.title}>驗證Email</Text>
        {errorMessage && <Text style={FormStyles.errorMessage}>{errorMessage}</Text>}
        <TextInput placeholder='驗證碼' value={code} style={[FormStyles.input]} onChangeText={text => setCode(text)}/>
        <Button onPress={confirm} icon={loading ? <Loading small color={'#fff'}/> : <View>
          <Text style={FormStyles.buttonText}>驗證</Text>
        </View>} style={{ ...FormStyles.submitButton, backgroundColor: code.length > 0 && !loading ? globalStyles.colors.primary : globalStyles.colors.primaryDisabled }}/>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default Confirm