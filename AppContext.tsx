import React, { ReactNode, createContext, useContext, useState } from 'react'
import { UserProps } from './src/utils/Constants';

interface AppContextType {
  user: UserProps | null
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>
  trigger: boolean
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

const AppStateContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppStateProvider: React.FC<AppProviderProps> = ({ children }) => {

  const [user, setUser] = useState<UserProps | null>(null);
  // utils
  const [trigger, setTrigger] = useState(false);

  return (
    <AppStateContext.Provider value={{ 
      user, setUser,
      trigger, setTrigger,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hook to access the context values
export const useAppState = () => {
  return useContext(AppStateContext);
};