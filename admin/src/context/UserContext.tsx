import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react'
import * as lebobeautycoTypes from ':lebobeautyco-types'

// Create context
export interface UserContextType {
  user: lebobeautycoTypes.User | null
  setUser: React.Dispatch<React.SetStateAction<lebobeautycoTypes.User | null>>
}

const UserContext = createContext<UserContextType | null>(null)

// Create a provider
interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<lebobeautycoTypes.User | null>(null)
  const value = useMemo(() => ({ user, setUser }), [user])

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  )
}

// Create a custom hook to access context
export const useUserContext = () => useContext(UserContext)
