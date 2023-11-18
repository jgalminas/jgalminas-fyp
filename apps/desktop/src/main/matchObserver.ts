import { authenticate, createHttp1Request, createWebSocketConnection } from "league-connect";

export enum GameEvent {
  START = "GameStart",
  FINISH = "WaitingForStats"
}

export type GameData = {
  gameId: number,
  isCustomGame: boolean,
  queue: {
    id: number,
    mapId: number,
    gameMode: string,
    isRanked: boolean,
    type: string
  }
}

export type SubscriptionEvent = Subscription['event'];

export type Subscription = {
  event: 'start',
  callback: (game: GameData) => void
} | {
  event: 'finish',
  callback: () => void
}

class MatchObserver {
  
  private subscribers: Subscription[] = [];
  private gameData: GameData | null = null;

  constructor() {
    this.init();
  }

  private init = async() => {
    
    const credentials = await authenticate({ awaitConnection: true });
    const ws = await createWebSocketConnection();

    ws.subscribe('/lol-gameflow/v1/gameflow-phase', async(data) => {

      if (data === GameEvent.START) {

        try {
          const req = await createHttp1Request({
            method: 'GET',
            url: '/lol-gameflow/v1/session',
          }, credentials);

          const data: any = await req.json()['gameData'];

          this.gameData = {
            gameId: data.gameId,
            isCustomGame: data.isCustomGame,
            queue: {
              id: data.queue.id,
              gameMode: data.queue.gameMode,
              isRanked: data.queue.isRanked,
              mapId: data.queue.mapId,
              type: data.queue.type
            }
          };

          this.subscribers.forEach(sub => sub.event === 'start' && sub.callback(this.gameData as GameData));

        } catch (err) {
          console.log(err);
        }
        
      } else if (data === GameEvent.FINISH) {
        this.gameData = null;
        this.subscribers.forEach(sub => sub.event === 'finish' && sub.callback());
      }

    });

  };

  public isInGame = () => this.gameData === null ? false : true;
  public getGameData = () => this.gameData;

  public on = <E extends SubscriptionEvent>(event: E, callback: Extract<Subscription, { event: E }>['callback']) => {

    this.subscribers.push({ event, callback } as Subscription);

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