import { createHttp1Request, createWebSocketConnection } from "league-connect";
import { PubSub } from "../core/pubsub";
import { clientManager } from "..";

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

export type MatchObserverEvents = {
  'start': (game: GameData) => void,
  'finish': () => void
}

export class MatchObserver extends PubSub<MatchObserverEvents> {
  
  private gameData: GameData | null = null;

  public observe = async() => {
    
    const ws = await createWebSocketConnection();

    ws.subscribe('/lol-gameflow/v1/gameflow-phase', async(data) => {

      if (data === GameEvent.START) {

        try {
          const req = await createHttp1Request({
            method: 'GET',
            url: '/lol-gameflow/v1/session',
          }, await clientManager.getCredentials());

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

          this.emit('start', this.gameData);

        } catch (err) {
          console.log(err);
        }
        
      } else if (data === GameEvent.FINISH) {
        this.gameData = null;
        this.emit('finish');
      }

    });

  };

  public isInGame = () => this.gameData === null ? false : true;
  public getGameData = () => this.gameData;

}