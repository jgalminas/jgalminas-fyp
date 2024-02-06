
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { WebSocketClient } from "./webSocketClient";

export type SocketContext = {
  socket: WebSocket | undefined
};

const SocketContext = createContext<SocketContext>({
  socket: undefined
})

export type WebSocketProviderProps = {
  client: WebSocketClient,
  children: ReactNode
}

export const WebSocketProvider = ({ children, client }: WebSocketProviderProps) => {

  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      (async() => {
        setSocket(await client.connect())
      })();
    }
  }, [session])
  
  const context: SocketContext = {
    socket
  };

  return (
    <SocketContext.Provider value={context}>
      { children }
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext);
