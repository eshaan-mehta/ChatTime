import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();

  return (
    <ChatContext.Provider value={{ user, setUser }}>
        { children }
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error("Context not used within provider.");
    }

    if (!context.user){
        context.user = JSON.parse(localStorage.getItem("userInfo"));
    }

    return context;
}

export default ChatProvider;
