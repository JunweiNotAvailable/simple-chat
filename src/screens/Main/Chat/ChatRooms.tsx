import { ScrollView, Image, TouchableWithoutFeedback, Pressable, SafeAreaView, StyleSheet, View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppState } from '../../../../AppContext'
import { useChatState } from './ChatContext'
import { ChatProps, MessageProps, UserProps, globalStyles, urls } from '../../../utils/Constants'
import Topbar from '../../Utils/Topbar'
import Button from '../../Utils/Button'
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { config } from '../../../utils/Config'
import { getTimeString, to12HourFormat } from '../../../utils/Functions'
import Pusher from 'pusher-js/react-native';

const ChatRooms = () => {

  const navigation = useNavigation();
  const props = { ...useAppState(), ...useChatState() };
  const [loading, setLoading] = useState(false);

  // load chats
  useEffect(() => {
    (async () => {
      if (props.user) {
        setLoading(true);
        const newChats = [];
        const newMessages = [];
        const newUsers = [];
        for (const id of props.user?.chats) {
          // load chat
          const res = (await axios.get(`${config.api.data.single}/single`, {params: {
            table: 'SimpleChat-Chats',
            id: id
          }})).data.Item;
          newChats.push(res);
          // load last message
          const msgRes = (await axios.get(`${config.api.data.single}/single?table=SimpleChat-Messages&id=${res.lastMessage}`)).data.Item;
          newMessages.push(msgRes);
          // load user
          const user = (await axios.get(`${config.api.data.single}/single?table=SimpleChat-Users&id=${res.users.filter((u: string) => u !== props.user?.id)[0]}`)).data.Item;
          newUsers.push(user);
        }
        const sorted = newMessages.sort((a: MessageProps, b: MessageProps) => a.time > b.time ? -1 : 1);
        props.setLastMessages?.(sorted);
        props.setUsers?.(newUsers); // unsorted
        props.setChatRooms?.(newChats.sort((a, b) => sorted.find(m => m.id === a.lastMessage).time > sorted.find(m => m.id === b.lastMessage).time ? -1 : 1));
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      // pusher setup and bind events
      const pusher = new Pusher('07ae5689578f057a0669', {
        cluster: 'ap3',
      });
      const channel = pusher.subscribe('simple-chat');
      channel.bind('message', handleMessage);
      return () => {
        channel.unbind('message', handleMessage);
        pusher.unsubscribe('simple-chat');
        pusher.disconnect();
      }
    }
  }, [loading]);

  // handle message
  const handleMessage = async (data: any) => {
    if (!props.chatRooms) return;
    for (let i = 0; i < props.chatRooms.length; i++) {
      if (props.chatRooms[i].id === data.data.chat) {
        props.setLastMessages?.(prev => prev.map((m, j) => j === i ? data.data.message : m));
      }
    }
  }

  const getChatId = (userId: string) => {
    if (!props.user) return '';
    if (userId > props.user.id) {
      return `${props.user.id}&${userId}`;
    }
    return `${userId}&${props.user.id}`;
  }

  const goToChat = (chat: ChatProps, i: number) => {
    if (!props.users) return;
    // update message status
    props.setLastMessages?.(prev => prev.map((m, j) => i === j ? { ...m, readUsers: [...new Set([...m.readUsers, props.user?.id || ''])] } : m));
    props.setChatUsers && props.setChatUsers(chat.users);
    props.setTrigger?.(!props.trigger);
    const user = props.users.find(u => chat.users.includes(u.id));
    if (!user) return;
    props.setOtherUser && props.setOtherUser(user);
    setTimeout(() => {
      props.setChatRoomId && props.setChatRoomId(getChatId(user.id));
    }, 10);
    setTimeout(() => {
      navigation.navigate('ChatRoom' as never);
    }, 20);
  }

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      
      {/* topbar */}
      <Topbar/>

      {/* search bar */}
      <View style={styles.searchBarContainer}>
        <Button 
          style={styles.searchBar}
          icon={<View style={styles.searchBarContent}>
            <Icon name='search' size={16} color={'#646464'}/>
            <Text style={{ marginLeft: 8, color: '#646464' }}>搜尋</Text>
          </View>}
          onPress={() => navigation.navigate('Search' as never)}
        />
      </View>

      {/* chat rooms */}
      <ScrollView style={styles.chatRoomsView} >
        <Pressable>
          {props.chatRooms?.map((chat, i) => {
            return (
              <TouchableWithoutFeedback key={`chat-${i}`} onPress={() => goToChat(chat, i)}>
                <View style={styles.chatRow}>
                  <View style={styles.avatar}>
                    <Image source={urls.avatar} style={styles.avatarImage}/>
                  </View>
                  <View style={styles.info}>
                    <View style={styles.nameTime}>
                      <Text style={styles.name}>{props.users?.find(u => chat.users.includes(u.id))?.name}</Text>
                      <Text style={[styles.time, { fontWeight: props.user && props.user.id !== props.lastMessages?.[i].senderId && !props.lastMessages?.[i].readUsers.includes(props.user?.id) ? 'bold' : 'normal' }]}>{props.lastMessages && to12HourFormat(getTimeString(new Date(props.lastMessages[i].time)))}</Text>
                    </View>
                    <Text style={[styles.lastMessage, props.user && props.user.id !== props.lastMessages?.[i].senderId && !props.lastMessages?.[i].readUsers.includes(props.user?.id) ? { color: '#000', fontWeight: 'bold' } : {}]} numberOfLines={1} ellipsizeMode='tail'>{props.lastMessages?.[i].senderId === props.user?.id && '你: '}{props.lastMessages?.[i].message}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          })}
        </Pressable>
      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchBar: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
  },
  searchBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatRoomsView: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chatRow: {
    flexDirection: 'row',
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    marginLeft: 16,
    justifyContent: 'center',
    flex: 1,
  },
  nameTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  time: {
    fontSize: 11,
  },
  lastMessage: {
    marginTop: 4,
    color: '#888',
  },
});

export default ChatRooms