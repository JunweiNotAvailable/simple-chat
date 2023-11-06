import { View, Text, SafeAreaView, TouchableWithoutFeedback, Image, Keyboard, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppState } from '../../../../AppContext'
import { useChatState } from './ChatContext'
import Topbar from '../../Utils/Topbar'
import { UserProps, globalStyles, urls } from '../../../utils/Constants'
import axios from 'axios'
import { config } from '../../../utils/Config'
import Loading from '../../Utils/Loading'
import { useNavigation } from '@react-navigation/native'

const Search = () => {

  const navigation = useNavigation();
  const props = { ...useAppState(), ...useChatState() };
  const [searchInput, setSearchInput] = useState('');
  const [initUsers, setInitUsers] = useState<UserProps[]>([]);
  const [searchUsers, setSearchUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);

  // initial load users
  useEffect(() => {
    (async () => {
      setLoading(true);
      // scan all
      const users = (await axios.get(`${config.api.data.single}/multiple?table=SimpleChat-Users&filter=`)).data;
      setInitUsers(users.filter((u: UserProps) => u.id !== props?.user?.id).sort((a: UserProps, b: UserProps) => a.createDate < b.createDate ? 1 : -1));
      setLoading(false);
    })();
  }, []);

  // set up users
  useEffect(() => {
    if (!searchInput) {
      setSearchUsers(initUsers);
    } else {
      // filter users
      const newUsers: UserProps[] = [];
      for (const u of initUsers) {
        if (u.name.toLowerCase().startsWith(searchInput.toLowerCase()) || u.id.toLowerCase().startsWith(searchInput.toLowerCase())) {
          newUsers.push(u);
        }
      }
      setSearchUsers(newUsers);
    }
  }, [initUsers, searchInput]);

  const getChatId = (userId: string) => {
    if (!props.user) return '';
    if (userId > props.user.id) {
      return `${props.user.id}&${userId}`;
    }
    return `${userId}&${props.user.id}`;
  }

  const goToChat = (user: UserProps) => {
    if (!props) return;
    props.setChatRoomId && props.setChatRoomId(getChatId(user.id));
    props.setChatUsers && props.setChatUsers([props.user?.id || '', user.id]);
    props.setOtherUser && props.setOtherUser(user);
    navigation.navigate('ChatRoom' as never);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, globalStyles.safeArea]}>

        {/* topbar */}
        <Topbar title='搜尋' back/>

        {/* search input */}
        <TextInput placeholder='搜尋' autoFocus value={searchInput} onChangeText={text => setSearchInput(text)} style={styles.input}/>

        {/* search users */}
        <ScrollView style={styles.list}>
          {loading ?
          <View style={{ width: '100%', padding: 16, alignItems: 'center', }}>
            <Loading/>
          </View>
          : 
          <Pressable>
            {searchUsers.map((user, i) => {
              return (
                <TouchableWithoutFeedback onPress={() => goToChat(user)}>
                  <View style={styles.user}>
                    <View style={styles.avatar}>
                      <Image source={urls.avatar} style={styles.avatarImage}/>
                    </View>
                    <View style={styles.names}>
                      <Text style={styles.name}>{user.name}</Text>
                      <Text style={styles.id}>{user.id}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
            })}
          </Pressable>}
        </ScrollView>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#eee',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 10,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  names: {
    marginLeft: 16,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  id: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  }
});

export default Search