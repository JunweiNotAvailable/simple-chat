import { AppState } from 'react-native';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { ChatProps, MessageProps, UserProps } from '../../../utils/Constants'
import { config } from '../../../utils/Config'
import Pusher from 'pusher-js/react-native';
import axios from 'axios';
import { useAppState } from '../../../../AppContext';

interface ChatContextType {
  chatRoomId: string
  setChatRoomId: React.Dispatch<React.SetStateAction<string>>
  chatUsers: string[]
  setChatUsers: React.Dispatch<React.SetStateAction<string[]>>
  chatRooms: ChatProps[]
  setChatRooms: React.Dispatch<React.SetStateAction<ChatProps[]>>
  lastMessages: MessageProps[]
  setLastMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>
  users: UserProps[]
  setUsers: React.Dispatch<React.SetStateAction<UserProps[]>>
  otherUser: UserProps | null
  setOtherUser: React.Dispatch<React.SetStateAction<UserProps | null>>
  isInRoom: boolean
  setIsInRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatStateContext = createContext<ChatContextType | undefined>(undefined);

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatStateProvider: React.FC<ChatProviderProps> = ({ children }) => {

  const props = useAppState();
  const [chatRoomId, setChatRoomId] = useState('');
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  // main page
  const [chatRooms, setChatRooms] = useState<ChatProps[]>([]);
  const [lastMessages, setLastMessages] = useState<MessageProps[]>([]);
  const [users, setUsers] = useState<UserProps[]>([]);
  // one user chat data
  const [otherUser, setOtherUser] = useState<UserProps | null>(null);
  const [isInRoom, setIsInRoom] = useState(false);
  // group

  return (
    <ChatStateContext.Provider value={{ 
      chatRoomId, setChatRoomId,
      chatUsers, setChatUsers,
      chatRooms, setChatRooms,
      lastMessages, setLastMessages,
      users, setUsers,
      otherUser, setOtherUser,
      isInRoom, setIsInRoom,
    }}>
      {children}
    </ChatStateContext.Provider>
  );
}

// Custom hook to access the context values
export const useChatState = () => {
  return useContext(ChatStateContext);
};