import { ipcMain } from "electron";
import { SummonerChannels } from "./index";



const registerHandlers = () => {

  ipcMain.on(SummonerChannels.Info, (e) => {
    e.returnValue = 10;
  });
  
}

export default registerHandlers;


