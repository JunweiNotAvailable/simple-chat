import { ScrollView, Pressable, SafeAreaView, View, StyleSheet, Text, Image, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppState } from '../../../../AppContext'
import { useProfileState } from './ProfileContext';
import { UserProps, globalStyles, urls } from '../../../utils/Constants';
import Button from '../../Utils/Button';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/AntDesign'
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { config } from '../../../utils/Config';
import { getImageUrl, uploadImage } from '../../../utils/Functions';
import { useNavigation } from '@react-navigation/native';

const Overflow = () => {

  const navigation = useNavigation();
  const props = { ...useAppState(), ...useProfileState() };
  const [bgUrl, setBgUrl] = useState('');
  const [userUrl, setUserUrl] = useState('');
  // status
  const [showImage, setShowImage] = useState(false);

  // get background images
  useEffect(() => {
    (async () => {
      if (!props.user) return;
      const bg = await getImageUrl('simplechat-bucket', props.user.background);
      setBgUrl(bg);
      const url = await getImageUrl('simplechat-bucket', props.user.avatar);
      setUserUrl(url);
    })();
  }, []);

  const pickBackgroundImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [7, 3],
      quality: 1,
      base64: true,
    });
    if (!result.canceled && props.user) {
      const extension = result.assets[0].uri.slice(result.assets[0].uri.length - 4).replace('.', '');
      const url = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setBgUrl(url);
      // upload to database
      const newUser: UserProps = { ...props.user, background: `${props.user.id}_bg.${extension}` };
      props.setUser?.(newUser);
      await axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Users', data: newUser });
      await uploadImage('simplechat-bucket', `${props.user.id}_bg.${extension}`, url);
    }
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!result.canceled && props.user) {
      const extension = result.assets[0].uri.slice(result.assets[0].uri.length - 4).replace('.', '');
      const url = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setUserUrl(url);
      // upload to database
      const newUser: UserProps = { ...props.user, avatar: `${props.user.id}.${extension}` };
      props.setUser?.(newUser);
      await axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Users', data: newUser });
      await uploadImage('simplechat-bucket', `${props.user.id}.${extension}`, url);
    }
  }

  return (
    <SafeAreaView style={[styles.container, globalStyles.safeArea]}>
      
      {/* top section */}
      <View style={styles.topSection}>
        {/* background */}
        <TouchableWithoutFeedback onPress={pickBackgroundImage}>
          <View style={styles.background}>
            {bgUrl && <Image source={{ uri: bgUrl }} style={styles.backgroundImage}/>}
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.nameAvatar}>
          <View style={styles.names}>
            <Text style={[styles.name]}>{props.user?.name}</Text>
            <Text style={[styles.name, styles.id]}>@{props.user?.id}</Text>
          </View>
          {/* avatar */}
          <TouchableWithoutFeedback onPress={props.user?.avatar === null ? () => setShowImage(true) : pickImage}>
            <View style={styles.avatar}>
              <Image source={userUrl ? { uri: userUrl } : urls.avatar} style={styles.avatarImage}/>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

      {/* button section */}
      <View style={styles.buttonSection}>
        <Button icon={<View style={styles.editButtonText}>
          <Icon name='edit' size={16}/>
          <Text style={{ marginLeft: 6, fontSize: 15 }}>編輯</Text>
        </View>} style={styles.editButton} onPress={() => {}}/>
        <Button icon={<IoniconsIcon name='ellipsis-horizontal-outline' size={16}/>} style={styles.settingsButton} onPress={() => navigation.navigate('Settings' as never)}/>
      </View>

      {/* about me */}
      <ScrollView style={styles.aboutMeSection}>
        {/* <Pressable>
          {<Text style={styles.aboutMe}>{props.user?.aboutMe}</Text>}
        </Pressable> */}
      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    width: '100%',
    position: 'relative',
  },
  background: {
    width: '100%',
    aspectRatio: 7/3,
    backgroundColor: '#ccc',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  nameAvatar: {
    flexDirection: 'row',
    paddingBottom: 12,
  },
  names: {
    flex: 1,
    paddingVertical: 20,
    padding: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 24,
  },
  id: {
    marginTop: 8,
    color: '#aaa',
    fontWeight: 'normal',
    fontSize: 16,
  },
  avatar: {
    height: 72,
    width: 72,
    marginLeft: 40,
    marginRight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    height: '140%',
    width: '140%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },

  aboutMeSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  aboutMe: {
    marginVertical: 12,
    fontSize: 16,
  },

  buttonSection: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#eeeeef',
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  editButtonText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    backgroundColor: '#eeeeef',
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 12,
  },
});

export default Overflow