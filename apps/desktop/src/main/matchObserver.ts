import { createHttp1Request, createWebSocketConnection, authenticate } from "league-connect";
import { ObjectId } from 'bson';
import { getMetadata } from "./ipc/recording/file";
import path from "path";
import { app } from "electron";
import { VIDEO_DIRECTORY, VIDEO_FORMAT } from "../constants";
import { MatchRecorderIPC } from "./matchRecorderIPC";
import { ClientManager } from "./clientManager";
import { CHAMPIONS } from "../constants";
import { MainRequestBuilder } from "./util/request";
import { getApiCookieString } from "./util/cookie";
import { mainWindow } from ".";
import { RecordingIPC } from "../shared/ipc";

export enum GameEvent {
  START = "GameStart",
  FINISH = "WaitingForStats"
}

type Player = {
  championId: number,
  selectedPosition?: string,
  summonerInternalName: string
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
  },
  teamOne: Player[],
  teamTwo: Player[]
}

export class MatchObserver {

  private clientManager: ClientManager;
  private matchRecorderIPC: MatchRecorderIPC;
  private gameData: GameData | null = null;

  constructor(
    clientManager: ClientManager,
    matchRecorderIPC: MatchRecorderIPC
  ) {
    this.clientManager = clientManager;
    this.matchRecorderIPC = matchRecorderIPC;
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
            },
            teamOne: data.teamOne,
            teamTwo: data.teamTwo
          };

          this.matchRecorderIPC.startRecording(this.gameData);

        } catch (err) {
          console.log(err);
        }
        
      } else if (data === GameEvent.FINISH) {

        const matchId = new ObjectId().toString();

        new MainRequestBuilder()
        .route('/v1/match')
        .method('POST')
        .headers({
          Cookie: await getApiCookieString()
        })
        .body(
          {
            matchId,
            gameId: this.gameData?.gameId,
            region: this.clientManager.getPlayer()?.region
          }
        )
        .fetch();

        await this.matchRecorderIPC.stopRecording();

        const gameId = this.gameData?.gameId.toString() as string;
        const filePath = path.join(app.getPath('videos'), VIDEO_DIRECTORY, gameId + '.' + VIDEO_FORMAT);        

        try {
          
          // get recording metadata
          const metadata = await getMetadata(filePath);        

          // get player data
          let player = this.gameData?.teamOne.find(p => p.summonerInternalName === this.clientManager.getPlayer()?.username);
          
          if (player === undefined) {
            player = this.gameData?.teamTwo.find(p => p.summonerInternalName === this.clientManager.getPlayer()?.username);
          }

          if (player) {

            const res = await new MainRequestBuilder()
              .route('/v1/recording')
              .method('POST')
              .headers({
                Cookie: await getApiCookieString()
              })
              .body({
                match: matchId,
                champion: CHAMPIONS[player.championId].id,
                createdAt: new Date(),
                gameId: gameId,
                length: metadata.format.duration as number,
                size: metadata.format.size as number,
                position: player.selectedPosition,
                queueId: this.gameData?.queue.id as number
              })
              .fetch();

            if (res.ok) {
              mainWindow?.webContents.send(RecordingIPC.Created, await res.json());
            }

          }
          
        } catch (err) {
          console.log(err);
        }

        this.gameData = null;
      }

    });

  };

  public isInGame = () => this.gameData === null ? false : true;
  public getGameData = () => this.gameData;

}