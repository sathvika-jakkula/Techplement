import React, { createContext, useState, useContext } from 'react';

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  
  const updateMessages = (newChat) => {
    setMessages(newChat);
  };

  return (
    <ChatsContext.Provider value={{ messages, updateMessages }}>
      {children}
    </ChatsContext.Provider>
  );
};

export const useMessages = () => useContext(ChatsContext);
