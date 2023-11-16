import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { MessageProps, globalStyles, urls, weekDays } from '../../../utils/Constants'
import { useAppState } from '../../../../AppContext'
import { useChatState } from './ChatContext'
import { getDateString, getTimeString, to12HourFormat } from '../../../utils/Functions'

interface Props {
  message: MessageProps
  prevMessage: MessageProps
  nextMessage: MessageProps
}

const MessageRow: React.FC<Props> = ({ message, prevMessage, nextMessage }) => {

  const props = { ...useAppState(), ...useChatState() };
  const user = props.user?.id === message.senderId ? props.user : props.otherUser;
  const isMe = user?.id === props.user?.id;
  // const url = props.urls[user?.id];

  // check if the time of two messages are too far
  const isTooFar = (msg1: MessageProps, msg2: MessageProps) => {
    if (!msg1 || !msg2) return true;
    const sec = Math.abs(new Date(msg1.time).getTime() - new Date(msg2.time).getTime()) / 1000;
    const hours = sec / 3600;
    return hours > 3;
  }

  return (
    isMe ?
    <View style={[styles.container, { marginTop: user?.id === prevMessage?.senderId ? 4 : 8 }]}>
      {(isTooFar(message, nextMessage) || nextMessage?.senderId !== user?.id) && <Text style={styles.smallTime}>{getTimeString(new Date(message.time))}</Text>}
      <View style={[styles.message, {
        borderTopRightRadius: prevMessage?.senderId === user?.id && !isTooFar(message, prevMessage) ? 8 : 16,
        borderBottomRightRadius: nextMessage?.senderId === user?.id && !isTooFar(message, nextMessage) ? 8 : 16,
        backgroundColor: globalStyles.colors.primary,
      }]}>
        <Text style={[styles.messageText, { color: '#fff' }]}>{message.message}</Text>
      </View>
    </View>
    :

    <View style={[styles.containerOther, { marginTop: user?.id === prevMessage?.senderId ? 4 : 8 }]}>
      <View style={[styles.avatar]}>
        {nextMessage?.senderId === user?.id && !isTooFar(message, nextMessage) ? <></> : <Image source={props.userUrls[user?.id as string] ? { uri: props.userUrls[user?.id as string] } : urls.avatar} style={styles.avatarImage}/>}
      </View>
      <View style={[styles.message, styles.messageLeft, {
        borderTopLeftRadius: prevMessage?.senderId === user?.id && !isTooFar(message, prevMessage) ? 8 : 16,
        borderBottomLeftRadius: nextMessage?.senderId === user?.id && !isTooFar(message, nextMessage) ? 8 : 16,
        backgroundColor: '#eee',
      }]}>
        <Text style={styles.messageText}>{message.message}</Text>
      </View>
      {(isTooFar(message, nextMessage) || nextMessage?.senderId !== user?.id) && <Text style={styles.smallTime}>{getTimeString(new Date(message.time))}</Text>}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    flexDirection: 'row', 
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  containerOther: {
    marginTop: 4,
    flexDirection: 'row', 
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  message: {
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 16,
    maxWidth: '70%',
  },
  messageLeft: {
    marginLeft: 12,
  },
  messageText: {
    fontSize: 15,
  },
  smallTime: {
    fontSize: 10,
    margin: 4,
    color: '#ccc',
  },
});

export default MessageRow