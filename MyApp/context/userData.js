import React, { createContext, useContext, useState } from 'react';
import { Text, View } from 'react-native';

// Создаём контекст
export const UserContext = createContext();

const UserProvider = ({children}) => {
  const [userData, setUserData] = useState({
    name: "Пользователь",
  });
  const [isLogged, setIsLogged] = useState(false);

  return (
    <UserContext.Provider value={{ userData, setUserData, isLogged, setIsLogged }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
