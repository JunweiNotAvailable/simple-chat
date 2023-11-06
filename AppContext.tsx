import React, { ReactNode, createContext, useContext, useState } from 'react'
import { UserProps } from './src/utils/Constants';

interface AppContextType {
  user: UserProps | null
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>
}

const AppStateContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppStateProvider: React.FC<AppProviderProps> = ({ children }) => {

  const [user, setUser] = useState<UserProps | null>(null);

  return (
    <AppStateContext.Provider value={{ 
      user, setUser,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hook to access the context values
export const useAppState = () => {
  return useContext(AppStateContext);
};