import env from "@root/env";
import { useEffect } from "react";

/**
 * A custom hook to create a socket connection
 */

let socket: WebSocket | null = null;
let subscribers = 0;

export const useWebSocket = () => {

    let retries = 0;

    const connect = () => {

        if (socket === null) {
            const ws = new WebSocket(env.RENDERER_VITE_SOCKET_URL);
        
            ws.onopen = () => {
                socket = ws;
                retries = 0;
            }
    
            ws.onclose = (event) => {
                if (event.code !== 1000 && event.code !== 1006 && ws.readyState !== WebSocket.OPEN) {
                    reconnect();
                }
            }
        }

    } 

    const reconnect = () => {
        setTimeout(() => {
            retries += 1;
            connect();
        }, 1000 * Math.pow(2, retries))
    }

    useEffect(() => {
        subscribers += 1;
        connect();

        return () => {
            subscribers -= 1;
            if (subscribers === 0) {
                socket?.close(1000);
            }
        }
 
    }, [])

    return { socket: socket }
}