import { ipcMain } from "electron";
import { mainWindow } from "./";
import { GameData } from "./matchObserver";
import { RecorderIPC } from "../shared/ipc";

export class MatchRecorderIPC {

  public startRecording(data: GameData) {
    mainWindow?.webContents.send(RecorderIPC.Start, data);
  }

  public async stopRecording(): Promise<void> {    
    mainWindow?.webContents.send(RecorderIPC.Finish);

    return new Promise((resolve) => {
      ipcMain.on(RecorderIPC.Response, () => {
        console.log("stopped recording");
        resolve();
      })
    })
  }

}