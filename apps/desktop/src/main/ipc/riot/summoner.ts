import { ipcMain } from "electron";
import { Regions } from "twisted/dist/constants";
import { lolApi } from "../../api";
import { SummonerChannels } from "../../../channels";

export default () => {

  ipcMain.handle(SummonerChannels.Info, async() => {
    const x = await lolApi.Summoner.getByName("name", Regions.EU_WEST);
    console.log(x);
    return x;
  })
  
}