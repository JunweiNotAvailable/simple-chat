import { Platform } from "react-native";

export const globalStyles = {
  safeArea: {
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  colors: {
    primary: "#03a5fc",
    primaryDisabled: '#b5dff5',
    gray: "#ccc",
    green: '#70cd96',
    red: '#ec8265',
    error: '#fa5448',
    online: '#5ad662',
  },
  absolute: {
    position: 'absolute',
  },
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignItems: {
    center: { alignItems: 'center' },
    flexStart: { alignItems: 'flex-start' },
    flexEnd: { alignItems: 'flex-end' },
  },
  justifyContent: {
    center: { justifyContent: 'center' },
    flexStart: { justifyContent: 'flex-start' },
    flexEnd: { justifyContent: 'flex-end' },
    spaceBetween: { justifyContent: 'space-between' },
    spaceAround: { justifyContent: 'space-around' },
    spaceEvenly: { justifyContent: 'space-evenly' },
  },
  bold: { fontWeight: 'bold' }
}

export const urls = {
  user: require('../../assets/images/user.png'),
  userColored: require('../../assets/images/user-colored.png'),
  chat: require('../../assets/images/chat.png'),
  chatColored: require('../../assets/images/chat-colored.png'),
  avatar: require('../../assets/images/avatar.png'),
}

// props
export interface UserProps {
  id: string
  name: string
  avatar: string
  createDate: string
  isOnline: boolean
  lastOnlineTime: string
}

export interface ChatProps {
  id: string
  name: string
  avatar: string
  users: string[]
  lastMessageTime: string
  lastMessageSender: string
  lastMessage: string
  lastMessageStatus: string
}

export interface MessageProps {
  id: string
  senderId: string
  chatRoomId: string
  time: string
  message: string
  readUsers: string[]
}