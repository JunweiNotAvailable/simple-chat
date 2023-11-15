import { ScrollView, Pressable, SafeAreaView, View, StyleSheet, Text, Image } from 'react-native'
import React from 'react'
import { useAppState } from '../../../../AppContext'
import { useProfileState } from './ProfileContext';
import { globalStyles, urls } from '../../../utils/Constants';
import Button from '../../Utils/Button';
import Icon from 'react-native-vector-icons/AntDesign'

const Profile = () => {

  const props = { ...useAppState(), ...useProfileState() };

  return (
    <SafeAreaView style={[styles.container, globalStyles.safeArea]}>
      
      {/* top section */}
      <View style={styles.topSection}>
        <Button onPress={() => {}}/>
        <View style={styles.background}>
          {/* {props.user?.background && <Image source={}/>} */}
        </View>
        <View style={styles.nameAvatar}>
          <View style={styles.names}>
            <Text style={[styles.name]}>{props.user?.name}</Text>
            <Text style={[styles.name, styles.id]}>@{props.user?.id}</Text>
          </View>
          <View style={styles.avatar}>
            <Image source={urls.avatar} style={styles.avatarImage}/>
          </View>
        </View>
      </View>

      {/* button section */}
      <View style={styles.buttonSection}>
        <Button icon={<View style={styles.editButtonText}>
          <Icon name='edit' size={16}/>
          <Text style={{ marginLeft: 6, fontSize: 16 }}>編輯</Text>
        </View>} style={styles.editButton} onPress={() => {}}/>
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
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  editButton: {
    backgroundColor: '#eeeeef',
    padding: 10,
    borderRadius: 10,
  },
  editButtonText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile