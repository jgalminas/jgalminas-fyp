import { readFile } from "fs/promises";
import path from "path";
import https from 'https';

export enum LCEvent {
  GAME_START = 0,
  GAME_END = 9
}

export type GameEvent = {
  EventID: number,
  EventName: string,
  EventTime: number
}

export type SubscriptionEvent = 'start' | 'end';

export type Subscription = {
  event: SubscriptionEvent,
  callback: () => void
}

class MatchObserver {
  
  static MS_FREQUENCY = 1000;
  static BASE_URL = 'https://127.0.0.1:2999/liveclientdata/eventdata';
  static CERT_PATH = path.join(process.cwd(), '..', '..', 'riotgames.pem');
  private inGame = false;
  private cert: Buffer | undefined; 
  private subscribers: Subscription[] = [];

  constructor() {
    this.readCert();
    this.loop();
  }

  private readCert = async() => {
    this.cert = await readFile(MatchObserver.CERT_PATH);
  }

  private loop = async() => {
    setInterval(async() => {

      //TODO: handle game leaving

      if (!this.inGame) {
        const events = await this.fetchEventByID(LCEvent.GAME_START);
        if (events && events.Events.find(e => e.EventID === LCEvent.GAME_START)) {
          this.inGame = true;
        }
      } else {
        const events = await this.fetchEventByID(LCEvent.GAME_END);
        if (events && events.Events.find(e => e.EventID === LCEvent.GAME_END)) {
          this.inGame = false;
        }
      }

    }, MatchObserver.MS_FREQUENCY);
  }

  private fetchEventByID = async(id: LCEvent) => {
    try {
      // TODO: use zod to verify returned data as first few frames seem to be invalid
      return await this.fetch(`${MatchObserver.BASE_URL}?eventID=${id}`) as { Events: GameEvent[] };
    } catch {
      return null;
    }
  }

  private fetch = async (url: string, method: 'GET' | 'POST' = 'GET'): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!this.cert) {
        reject(new Error("Certificate not loaded"))
      } else {
        https.get(url, { method, agent: new https.Agent({ ca: [this.cert] }) }, (res) => {
          let data = '';
  
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve(Promise.resolve(JSON.parse(data))));
          res.on('error', (err) => reject(err));
        }).on('error', (err) => reject(err));
      }
    })
  }

  public isInGame = () => this.inGame;

  public on = (event: SubscriptionEvent, callback: () => void) => {

    this.subscribers.push({ event, callback });

    return {
      unsubscribe: () => {
        const index = this.subscribers.length - 1;
        this.subscribers = [
          ...this.subscribers.slice(0, index),
          ...this.subscribers.slice(index + 1, this.subscribers.length)
        ];
      }
    }
  };

}

export const matchObserver = new MatchObserver(); 