import { WebSocketEvent } from "@fyp/types";
import { Server, WebSocket } from "ws";


export class WebSocketService {

    private wss: Server;
    private clients: Map<string, WebSocket> = new Map();

    constructor(wss: Server) {
        this.wss = wss;

        setInterval(() => {
            this.clients
        }, 2000)

        // handle connections
        this.wss.on('connection', (ws, req) => {
            if (req.session) {
                this.clients.set(req.session.id, ws);
            }

            ws.on('close', () => {
                this.clients.delete(req.session.id);
            })
        })
    }

    public send(sessions: string[], event: WebSocketEvent) {
        console.log(this.clients);
        
        sessions.forEach((session) => {
            const socket = this.clients.get(session);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(event));
            }
        })
    } 

}