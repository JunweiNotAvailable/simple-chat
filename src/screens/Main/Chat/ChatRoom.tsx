import { View, Text, TouchableWithoutFeedback, Pressable, Keyboard, SafeAreaView, StyleSheet, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAppState } from '../../../../AppContext';
import { useChatState } from './ChatContext';
import { ChatProps, MessageProps, globalStyles, urls, weekDays } from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { config } from '../../../utils/Config';
import { getDateString, getRandomString, getTimeString, to12HourFormat } from '../../../utils/Functions';
import Loading from '../../Utils/Loading';
import Button from '../../Utils/Button';
import Pusher from 'pusher-js/react-native';
import MessageRow from './MessageRow';

const ChatRoom = () => {

  const navigation = useNavigation();
  const props = { ...useAppState(), ...useChatState() };
  const messagesRef = useRef(null);
  const [chat, setChat] = useState<ChatProps | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [lastReadMessage, setLastReadMessage] = useState<MessageProps>(messages[0]);
  const [messageInput, setMessageInput] = useState('');
  // one user data

  // load messages
  const [paginationToken, setPaginationToken] = useState('');
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(10);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [canLoad, setCanload] = useState(true);
  const [heightDiff, setHeightDiff] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  useEffect(() => {
    if (props.otherUser) {
      const myMessages = messages.filter(m => m.senderId === props.user?.id);
      for (let i = 0; i < myMessages.length; i++) {
        if (myMessages[i].readUsers.includes(props.otherUser.id) && !myMessages[i + 1]?.readUsers.includes(props.otherUser.id)) {
          setLastReadMessage(myMessages[i]);
        }
      }
    }
  }, [messages]);

  // load chat
  useEffect(() => {
    // load data
    (async () => {
      let chatData;
      try {
        chatData = (await axios.get(`${config.api.data.single}/single`, { params: {
          table: 'SimpleChat-Chats',
          id: props.chatRoomId
        } })).data.Item;
        setChat(chatData);
        // load messages
        const res = (await axios.get(`${config.api.data.laijoig}/query-items`, {params: {
          table: 'SimpleChat-Messages',
          roomId: chatData.id,
          paginationToken: paginationToken,
        }})).data;
        const newMessages = res.items.sort((a: MessageProps, b: MessageProps) => a.time < b.time ? -1 : 1);
        setMessages(newMessages);
        setTimeout(() => (messagesRef.current as any)?.scrollToEnd({ animated: false }), 10);
        setPaginationToken(res.paginationToken);
        await axios.post(`${config.api.pusher}/event`, {
          channel: 'simple-chat',
          eventName: 'read',
          data: {
            chat: chatData.id,
            reader: props.user?.id,
          },
        });
        for (const message of newMessages) {
          if (props.user && message.senderId === props.otherUser?.id && !message.readUsers.includes(props.user.id)) {
            const newMessage: MessageProps = { ...message, readUsers: [...new Set([...message.readUsers, props.user.id])] }
            axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Messages', data: newMessage });
          }
        }
      } catch (error) { // no chat data
        console.log(error)
      }
      // create new chat room if first time
      if (!chatData) {
        if (!props.user || !props.otherUser) return;
        const newChat: ChatProps = {
          id: props.chatRoomId || getRandomString(12),
          name: props.chatRoomId || '',
          avatar: props.otherUser?.avatar || '',
          users: props.chatUsers || [],
          lastMessage: '',
        };
        setChat(newChat);
        await axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Chats', data: newChat });
        await axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Users', data: { ...props.user, chats: [...props.user.chats, newChat.id] } });
        await axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Users', data: { ...props.otherUser, chats: [...props.otherUser.chats, newChat.id] } });
      }
    })();
  }, []);
  
  // load more messages when scroll y is 0
  useEffect(() => {
    if (paginationToken === 'null' || !canLoad) return;
    if (scrollY < 0 && !loadingMore) {
      (async () => {
        setLoadingMore(true);
        // set threshold
        setCanload(false);
        setTimeout(() => setCanload(true), 2000);
        const res = (await axios.get(`${config.api.data.laijoig}/query-items`, {params: {
          table: 'SimpleChat-Messages',
          roomId: props.chatRoomId,
          paginationToken: paginationToken,
        }})).data;
        setMessages(prev => [...prev, ...res.items].sort((a, b) => a.time < b.time ? -1 : 1));
        setPaginationToken(res.paginationToken);
        // scroll to current position
        setTimeout(() => (messagesRef.current as any).scrollTo({ y: heightDiff, animated: false }), 10);
        setLoadingMore(false);
      })();
    }
  }, [scrollY]);

  // pusher setup and bind events
  useEffect(() => {
    const pusher = new Pusher('07ae5689578f057a0669', {
      cluster: 'ap3',
    });
    const channel = pusher.subscribe('simple-chat');
    channel.bind('message', handleMessage);
    channel.bind('read', handleRead);
    return () => {
      channel.unbind('message', handleMessage);
      channel.unbind('read', handleRead);
      pusher.unsubscribe('simple-chat');
      pusher.disconnect();
    }
  }, []);

  // handle message
  const handleMessage = async (data: any) => {
    if (data.data.sender === props.otherUser?.id && data.data.chat === props.chatRoomId) {
      setMessages(prev => [...prev, data.data.message]);
      (messagesRef.current as any)?.scrollToEnd({ animated: true });
      await axios.post(`${config.api.pusher}/event`, {
        channel: 'simple-chat',
        eventName: 'read',
        data: {
          chat: props.chatRoomId,
          reader: props.user?.id,
        },
      });
      for (const message of messages) {
        if (props.user && message.senderId === props.otherUser?.id && !message.readUsers.includes(props.user.id)) {
          const newMessage: MessageProps = { ...message, readUsers: [...new Set([...message.readUsers, props.user.id])] }
          axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Messages', data: newMessage });
        }
      }
      // last message
      props.setLastMessages?.(prev => prev.map((m, i) => props.chatRooms?.[i].id === props.chatRoomId ? { ...m, readUsers: [...new Set([...m.readUsers, props.user?.id || ''])] } : m));
    }
  }
  const handleRead = (data: any) => {
    if (data.data.reader === props.otherUser?.id && data.data.chat === props.chatRoomId) {
      setMessages(prev => prev.map(m => { return { ...m, readUsers: [...new Set([...m.readUsers, props.otherUser?.id || ''])] } }));
    }
  }

  // send the message
  const sendMessage = async () => {
    if (!props.user || !chat || messageInput.trim().length === 0) return;
    // store message to database
    const newMessage: MessageProps = {
      id: getRandomString(12),
      senderId: props.user.id,
      roomId: chat.id,
      time: new Date().toISOString(),
      message: messageInput.trim(),
      readUsers: [],
    };
    setMessages([...messages, newMessage]);
    (messagesRef.current as any).scrollToEnd({ animated: true });
    setMessageInput('');
    axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Messages', data: newMessage });
    // real-time
    axios.post(`${config.api.pusher}/event`, {
      channel: 'simple-chat',
      eventName: 'message',
      data: {
        chat: chat.id,
        sender: props.user.id,
        message: newMessage,
      },
    });
    const newChat: ChatProps = {
      ...chat,
      lastMessage: newMessage.id,
    };
    setChat(newChat);
    axios.post(`${config.api.data.single}/single`, { table: 'SimpleChat-Chats', data: newChat });
    // notifications
    if (!props.isInRoom) {

    }
  }

  // check if the time of two messages are too far
  const isTooFar = (msg1: MessageProps, msg2: MessageProps) => {
    if (!msg1 || !msg2) return true;
    const sec = Math.abs(new Date(msg1.time).getTime() - new Date(msg2.time).getTime()) / 1000;
    const hours = sec / 3600;
    return hours > 3;
  }

  return (
    chat ?
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'android' ? undefined : 'padding'}>
          
          {/* topbar */}
          <View style={styles.topbar}>
            <Icon name='chevron-left' size={26} onPress={() => {
              props.setChatRoomId?.('');
              props.setOtherUser?.(null);
              navigation.goBack();
            }}/>
            <View style={[styles.avatar, { borderColor: !props.isInRoom ? '#ccc' : globalStyles.colors.online }]}>
              <Image source={urls.avatar} style={styles.avatarImage}/>
            </View>
            <View style={styles.usernameGroup}>
              <Text style={styles.username} numberOfLines={1} ellipsizeMode='tail'>{props.otherUser?.name}</Text>
              <View style={styles.lastTimeView}>
                {/* <Text style={styles.lastTime}></Text> */}
                {/* {isInRoom && <View style={styles.isInRoom}/>} */}
              </View>
            </View>
          </View>

          {/* messages */}
          <ScrollView style={styles.messagesView} ref={messagesRef}
            onScroll={(e) => {
              // setup heights
              (messagesRef.current as any).measure((x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
                setViewHeight(height);
              });
              setContentHeight(e.nativeEvent.contentSize.height);
              // set scrolling values
              const scrollHeight = e.nativeEvent.contentSize.height - viewHeight;
              const toEnd = scrollHeight - e.nativeEvent.contentOffset.y;
              setScrollY(e.nativeEvent.contentOffset.y);
              setIsScrollingUp(toEnd > 800)
              // get current position
              if (e.nativeEvent.contentSize.height - contentHeight > 0) {
                setHeightDiff(e.nativeEvent.contentSize.height - contentHeight);
              }
            }}
            scrollEventThrottle={16}
          >
            <Pressable>
              {loadingMore && <View style={styles.loadingMore}>
                <Loading/>  
              </View>}
              {messages.map((msg, i) => {
                return (
                  <React.Fragment key={`msg-${i}`}>
                    {isTooFar(msg, messages[i - 1]) && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={styles.globalTimeText}>{getDateString(new Date()) !== getDateString(new Date(msg.time)) ? weekDays[new Date(msg.time).getDay()] : ''} {to12HourFormat(getTimeString(new Date(msg.time)))}</Text>
                    </View>}
                    <View key={`${msg.id}`} style={i === messages.length - 1 && (lastReadMessage?.id !== msg.id) ? { marginBottom: 8 } : {}}>
                      <MessageRow
                        message={msg}
                        prevMessage={messages[i - 1]}
                        nextMessage={messages[i + 1]}
                      />
                    </View>
                    {(lastReadMessage?.id === msg.id) && <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                      <Text style={styles.readText}>已看過</Text>  
                    </View>}
                  </React.Fragment>
                )
              })}
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
    // borderWidth: 1.6,
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
  lastTimeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  lastTime: {
    fontSize: 11,
    color: '#888',
  },
  isInRoom: {
    width: 6,
    height: 6,
    marginLeft: 6,
    borderRadius: 10,
    backgroundColor: globalStyles.colors.online,
  },
  messagesView: {
    flex: 1,
    paddingHorizontal: 12,
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

  // messages
  globalTimeText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 24,
    marginBottom: 12,
  },
  readText: {
    margin: 4,
    fontSize: 12,
    color: '#aaa',
  },
  loadingMore: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default ChatRoom