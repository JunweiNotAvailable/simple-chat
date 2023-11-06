import { View, Text, TouchableWithoutFeedback, Pressable, Keyboard, SafeAreaView, StyleSheet, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAppState } from '../../../../AppContext';
import { useChatState } from './ChatContext';
import { ChatProps, MessageProps, globalStyles, urls } from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { config } from '../../../utils/Config';
import { getMinutesBetween, getPrettyOnlineString, getRandomString } from '../../../utils/Functions';
import Loading from '../../Utils/Loading';
import Button from '../../Utils/Button';

const ChatRoom = () => {

  const navigation = useNavigation();
  const props = { ...useAppState(), ...useChatState() };
  const messagesRef = useRef(null);
  const [chat, setChat] = useState<ChatProps | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [messageInput, setMessageInput] = useState('');
  // one user data
  const [onlineTime, setOnlineTime] = useState(getMinutesBetween(new Date(props.otherUser?.lastOnlineTime || ''), new Date()));

  // load chat
  useEffect(() => {
    (async () => {
      let chatData;
      try {
        chatData = (await axios.get(`${config.api.data.single}/single`, { params: {
          table: 'SimpleChat-Chats',
          id: props.chatRoomId
        } })).data.Item;
        setChat(chatData);
      } catch (error) { // no chat data
        console.log(error)
      }
      // create new chat room if first time
      if (!chatData) {
        const newChat: ChatProps = {
          id: props.chatRoomId || getRandomString(12),
          name: props.otherUser?.name || '',
          avatar: props.otherUser?.avatar || '',
          users: props.chatUsers || [],
          lastMessageTime: '',
          lastMessageSender: '',
          lastMessage: '',
          lastMessageStatus: '',
        };
        setChat(newChat);
        await axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Chats', data: newChat });
      }
    })();
  }, []);

  // send the message
  const sendMessage = async () => {
    if (!props.user || !chat) return;
    // store message to database
    const newMessage: MessageProps = {
      id: getRandomString(12),
      senderId: props.user.id,
      chatRoomId: chat.id,
      time: new Date().toISOString(),
      message: messageInput,
      readUsers: [],
    };
    setMessageInput('');
    // handle websocket & notifications
    
  }

  return (
    chat ?
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'android' ? undefined : 'padding'}>
          
          {/* topbar */}
          <View style={styles.topbar}>
            <Icon name='chevron-left' size={26} onPress={navigation.goBack}/>
            <View style={[styles.avatar, { borderColor: onlineTime > 10 ? '#ccc' : globalStyles.colors.online }]}>
              <Image source={urls.avatar} style={styles.avatarImage}/>
            </View>
            <View style={styles.usernameGroup}>
              <Text style={styles.username} numberOfLines={1} ellipsizeMode='tail'>{chat.name}</Text>
              <Text style={styles.lastTime}>{getPrettyOnlineString(onlineTime)}</Text>
            </View>
          </View>

          {/* messages */}
          <ScrollView style={styles.messagesView} ref={messagesRef}
            scrollEventThrottle={16}
          >
            <Pressable>

            </Pressable>
          </ScrollView>

          {/* input */}
          <View style={styles.inputGroup}>
            <TextInput style={styles.input} multiline placeholder='訊息...' value={messageInput} onChangeText={text => setMessageInput(text)}/>
            <Button text='傳送' style={styles.sendButton} textStyle={{ color: globalStyles.colors.primary, fontWeight: 'bold', fontSize: 15 }} onPress={sendMessage}/>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
    : // loading

    <View style={styles.loading}>
      <Loading/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    height: 56,
  },
  avatar: {
    borderWidth: 1.6,
    borderRadius: 50,
    height: 42,
    width: 42,
    marginLeft: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    height: '95%',
    width: '95%',
    borderRadius: 50,
  },
  usernameGroup: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  lastTime: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },
  messagesView: {
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    maxHeight: 80,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});

export default ChatRoom