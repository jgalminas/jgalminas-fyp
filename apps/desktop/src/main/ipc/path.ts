import { app, ipcMain } from "electron";
import { PathChannels } from "../../channels";

export default () => {

  ipcMain.on(PathChannels.Get, (e, path: Parameters<typeof app.getPath>[0]) => {
    e.returnValue = app.getPath(path);
  })
  
}