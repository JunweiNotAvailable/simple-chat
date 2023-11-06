import React, { ReactNode, createContext, useContext, useState } from 'react'
import { UserProps } from '../../../utils/Constants'

interface ChatContextType {
  chatRoomId: string
  setChatRoomId: React.Dispatch<React.SetStateAction<string>>
  chatUsers: string[]
  setChatUsers: React.Dispatch<React.SetStateAction<string[]>>
  otherUser: UserProps | null
  setOtherUser: React.Dispatch<React.SetStateAction<UserProps | null>>
}

const ChatStateContext = createContext<ChatContextType | undefined>(undefined);

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatStateProvider: React.FC<ChatProviderProps> = ({ children }) => {

  const [chatRoomId, setChatRoomId] = useState('');
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  // one user chat data
  const [otherUser, setOtherUser] = useState<UserProps | null>(null); 
  // group

  return (
    <ChatStateContext.Provider value={{ 
      chatRoomId, setChatRoomId,
      chatUsers, setChatUsers,
      otherUser, setOtherUser,
    }}>
      {children}
    </ChatStateContext.Provider>
  );
}

// Custom hook to access the context values
export const useChatState = () => {
  return useContext(ChatStateContext);
};