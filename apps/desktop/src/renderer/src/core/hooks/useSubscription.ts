import { useEffect } from "react";
import { WebSocketEvent } from "@fyp/types";
import { socketManager } from "@renderer/App";

/**
 * A custom hook to create a socket connection and register a message listener
 * @param callback A function to be executed on every message
 * @param deps An array of dependencies used within the callback function 
 */
export const useSubscription = (callback: (event: WebSocketEvent) => void, deps: any[] = []) => {

    const socket = socketManager.getSocket();

    useEffect(() => {

        const x = setInterval(() => {
            console.log(socket);
            
        }, 5000)

        const onMessage = (event: MessageEvent<any>) => {
            callback(JSON.parse(event.data) as WebSocketEvent);
        }

        if (socket) {
            socket.addEventListener('message', onMessage);
        }

        return () => {
            clearInterval(x)
            socket?.removeEventListener('message', onMessage);
        }

    }, [socket, ...deps]) 

} 

