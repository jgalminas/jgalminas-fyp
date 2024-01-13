import { createHttp1Request, createWebSocketConnection, authenticate } from "league-connect";
import { clientManager, mainWindow } from "./index";
import { ObjectId } from 'bson';
import { getMetadata } from "./ipc/recording/file";
import path from "path";
import { app } from "electron";
import { RecordingIPCManager } from "./recordingIpcManager";

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
  
  private recordingIPCManager: RecordingIPCManager;

  private gameData: GameData | null = null;

  constructor(recordingIPCManager: RecordingIPCManager) {
    this.recordingIPCManager = recordingIPCManager;
  }

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

        const matchId = new ObjectId().toString();

        mainWindow?.webContents.send('match:data', {
          matchId,
          gameId: this.gameData?.gameId,
          region: clientManager.getPlayer()?.region
        });

        const filePath = path.join(app.getPath('videos'), 'Fyp', this.gameData?.gameId.toString() as string);
        const metadata = await getMetadata(filePath);

        this.recordingIPCManager.post({
          match: matchId.toString()
        });

        this.gameData = null;
        mainWindow?.webContents.send('match:finish');

      }

    });

  };

  public isInGame = () => this.gameData === null ? false : true;
  public getGameData = () => this.gameData;

}