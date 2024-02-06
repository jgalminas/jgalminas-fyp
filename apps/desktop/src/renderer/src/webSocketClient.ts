import env from "@root/env";

export class WebSocketClient {
  
  private socket: WebSocket | undefined;
  private retries: number = 0;

  public connect(): Promise<WebSocket> {
    return new Promise((resolve) => {
      if (this.socket === undefined) {
        const ws = new WebSocket(env.RENDERER_VITE_SOCKET_URL);
    
        ws.onopen = () => {
            this.socket = ws;
            this.retries = 0;   
            resolve(ws);
        }
  
        ws.onclose = (event) => {
            if (event.code !== 1000 && event.code !== 1006 && ws.readyState !== WebSocket.OPEN) {
                this.reconnect();
            }
        }

        ws.onerror = () => this.reconnect();
      } else {
        resolve(this.socket);
      }
    })
  }

  private reconnect() {
    setTimeout(() => {
        this.retries += 1;
        this.connect();
    }, 1000 * Math.pow(2, this.retries))
}

  public getSocket() {
    return this.socket;
  }

  public close(code: number) {
    this.socket?.close(code);
    this.socket = undefined;
  }
  
}