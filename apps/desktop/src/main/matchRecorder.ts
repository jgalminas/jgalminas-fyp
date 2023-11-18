import { desktopCapturer } from "electron";
import { GAME_CLIENT_NAME } from "./util/constants";
import { matchObserver } from "./matchObserver";

export class MatchRecorder {

  constructor() {
    this.init();
  }
  
  private init = async() => {

    matchObserver.on('start', async(game) => {

      const client = await this.getGameClient(); 
      console.log(client);

    });

  } 

  private getGameClient = async(): Promise<Electron.DesktopCapturerSource> => {
    return new Promise((resolve, _) => {
      const interval = setInterval(async() => {
        const sources = await desktopCapturer.getSources({ types: ['window'] });
        const client = sources.find((x) => x.name === GAME_CLIENT_NAME);

        if (client) {
          clearTimeout(interval);
          resolve(client);
        };

      }, 1000);
  
    });
  }

}