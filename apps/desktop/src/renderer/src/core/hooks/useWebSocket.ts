import env from "@root/env";
import { useEffect, useState } from "react";

/**
 * A custom hook to create a socket connection
 */
export const useWebSocket = () => {

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {

        (async() => {
            const ws = new WebSocket(env.RENDERER_VITE_SOCKET_URL);
            ws.onopen = () => {
                setSocket(ws);
            }
        })();

        return () => {
            socket?.close();
        }
 
    }, [])

    return { socket }
}