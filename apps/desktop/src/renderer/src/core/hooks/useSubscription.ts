import { useEffect } from "react";
import { WebSocketEvent } from "@fyp/types";
import { useSocket } from "@renderer/WebSocketContext";

/**
 * A custom hook to create a socket connection and register a message listener
 * @param callback A function to be executed on every message
 * @param deps An array of dependencies used within the callback function 
 */
export const useSubscription = (callback: (event: WebSocketEvent) => void, deps: any[] = []) => {

    const { socket } = useSocket();

    useEffect(() => {

        const onMessage = (event: MessageEvent<any>) => {
            callback(JSON.parse(event.data) as WebSocketEvent);
        }

        if (socket) {
            socket.addEventListener('message', onMessage);
        }

        return () => {
            socket?.removeEventListener('message', onMessage);
        }

    }, [socket, ...deps]) 

} 

