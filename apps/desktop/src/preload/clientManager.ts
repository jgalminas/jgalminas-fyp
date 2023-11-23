import { ipcRenderer } from "electron";
import { Credentials, authenticate, LeagueClient } from "league-connect";
import { SummonerChannels } from "../channels";

export type Player = {
  username: string,
  profileIconId: number,
  tag: string,
  accountId: string,
  puuid: string,
  id: string,
  region: string
}

export class ClientManager {

  private credentials: Credentials | undefined;
  private player: Player | undefined;
  x: number | null = null;

  init = async() => {
    this.credentials = await authenticate({ awaitConnection: true });
    const client = new LeagueClient(this.credentials);

    await this.onConnect(this.credentials); // only runs when app is loaded
    client.on('connect', async(credentials) => await this.onConnect(credentials)); // runs every time the client is connected to while the app is loaded

    client.on('disconnect', () => {
      this.credentials = undefined;
      this.player = undefined;
    });

    client.start();
  }

  private onConnect = async(credentials: Credentials) => {
    this.credentials = credentials;
    
    const res = await ipcRenderer.invoke(SummonerChannels.Info);
    console.log(res);
    

    // const summonerReq = await createHttp1Request({
    //   method: 'GET',
    //   url: '/lol-summoner/v1/current-summoner',
    // }, credentials);

    // const summonerData = summonerReq.json();

    // const authReq = await createHttp1Request({
    //   method: 'GET',
    //   url: '/lol-rso-auth/v1/authorization',
    // }, credentials);

    // const region = authReq.json()['currentPlatformId'] as string;

    // const idsReq = await fetch('')

    

  }

  isConnected = () => this.credentials ? true : false;

  getPlayer = () => this.player;

  // gets League client credentials, the fucntion will wait until credentials are available before resolving
  getCredentials = async(): Promise<Credentials> => new Promise((resolve) => {
    const check = () => {
      if (this.credentials) {
        resolve(this.credentials);
      } else {
        setTimeout(check, 100)
      }
    }
    check();
  });

}