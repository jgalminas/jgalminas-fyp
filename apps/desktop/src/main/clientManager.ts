import { Credentials, authenticate, LeagueClient, createHttp1Request } from "league-connect";
import { MainRequestBuilder } from "./util/request";
import { getApiCookieString } from "./util/cookie";

export type Player = {
  username: string,
  tag: string,
  puuid: string,
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

    try {
      const response = await new MainRequestBuilder()
      .route('/v1/summoner/')
      .method('POST')
      .headers({
          Cookie: await getApiCookieString()
      })
      .body({
        username: summonerData.internalName,
        tag: summonerData.tagLine,
        region: region
      })
      .fetch();

      const data: { puuid: string, gameName: string, tagLine: string } = await response.json();

      this.player = {
        puuid: data.puuid,
        region: region,
        tag: summonerData.tagLine,
        username: summonerData.internalName
      }
    } catch (err) {
      console.log(err);
    }

  }

  isConnected = () => this.credentials ? true : false;
  getPlayer = () => this.player;

}