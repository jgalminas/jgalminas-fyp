import { createHttp1Request, createWebSocketConnection, authenticate } from "league-connect";
import { clientManager, lolApi, mainWindow } from "./index";
import { Regions } from "twisted/dist/constants";
import env from "../env";
import { api } from "./util/api";

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

export class MatchObserver {
  
  private gameData: GameData | null = null;

  public observe = async() => {
    
    const ws = await createWebSocketConnection();

    ws.subscribe('/lol-gameflow/v1/gameflow-phase', async(data) => {

      if (data === GameEvent.START) {

        try {
          const req = await createHttp1Request({
            method: 'GET',
            url: '/lol-gameflow/v1/session',
          }, await authenticate({ awaitConnection: true }));

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

          mainWindow?.webContents.send('match:start', this.gameData);

        } catch (err) {
          console.log(err);
        }
        
      } else if (data === GameEvent.FINISH) {

        console.log(this.gameData);

        this.gameData = null;
        mainWindow?.webContents.send('match:finish');

      }

    });

  };

  public isInGame = () => this.gameData === null ? false : true;
  public getGameData = () => this.gameData;

}