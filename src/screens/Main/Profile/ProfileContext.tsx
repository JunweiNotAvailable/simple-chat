import React, { ReactNode, createContext, useContext, useState } from 'react'

interface ProfileContextType {
  
}

const ProfileStateContext = createContext<ProfileContextType | undefined>(undefined);

type ProfileProviderProps = {
  children: ReactNode;
};

export const ProfileStateProvider: React.FC<ProfileProviderProps> = ({ children }) => {


  return (
    <ProfileStateContext.Provider value={{ 
      
    }}>
      {children}
    </ProfileStateContext.Provider>
  );
}

// Custom hook to access the context values
export const useProfileState = () => {
  return useContext(ProfileStateContext);
};