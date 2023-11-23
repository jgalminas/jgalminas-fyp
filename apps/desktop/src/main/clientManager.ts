import { Credentials, authenticate, LeagueClient, createHttp1Request } from "league-connect";
import { lolApi } from "./index";
import { Regions } from "twisted/dist/constants";

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

  init = async() => {
    const credentials = await authenticate({ awaitConnection: true });
    const client = new LeagueClient(credentials);

    await this.onConnect(credentials); // only runs when app is loaded
    client.on('connect', async(credentials) => await this.onConnect(credentials)); // runs every time the client is connected to while the app is loaded

    client.on('disconnect', () => {
      this.credentials = undefined;
      this.player = undefined;
    });

    client.start();
  }

  private onConnect = async(credentials: Credentials) => {
     
    if (this.credentials) return;
    this.credentials = credentials;

    const summonerReq = await createHttp1Request({
      method: 'GET',
      url: '/lol-summoner/v1/current-summoner',
    }, credentials);

    const summonerData: {
      internalName: string,
      tagLine: string
    } = summonerReq.json();

    const authReq = await createHttp1Request({
      method: 'GET',
      url: '/lol-rso-auth/v1/authorization',
    }, credentials);

    const region = authReq.json()['currentPlatformId'] as string;

    const { response } = await lolApi.Summoner.getByName(summonerData.internalName, region as Regions);

    this.player = {
      id: response.id,
      accountId: response.accountId,
      puuid: response.puuid,
      profileIconId: response.profileIconId,
      region: region,
      tag: summonerData.tagLine,
      username: summonerData.internalName
    }

  }

  isConnected = () => this.credentials ? true : false;
  getPlayer = () => this.player;

}