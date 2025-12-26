import { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return sessionStorage.getItem("currentUser") || "";
  });

  const [roomId, setRoomId] = useState(() => {
    return sessionStorage.getItem("roomId") || "";
  });

  const [connected, setConnected] = useState(() => {
    return sessionStorage.getItem("connected") === "true" || false;
  });

  useEffect(() => {
    sessionStorage.setItem("currentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    sessionStorage.setItem("roomId", roomId);
  }, [roomId]);

  useEffect(() => {
    sessionStorage.setItem("connected", connected.toString());
  }, [connected]);

  return (
    <ChatContext.Provider
      value={{
        roomId,
        setRoomId,
        currentUser,
        setCurrentUser,
        connected,
        setConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);

export default useChatContext;
