import { app, ipcMain } from "electron";
import { ConfigIPC } from "../../shared/ipc";
import { videoServerHttp } from "../videoServer";

export default () => {

  ipcMain.on(ConfigIPC.VideoPort, (e) => {
    // @ts-expect-error
    e.returnValue = videoServerHttp.address()?.port;
  })

  ipcMain.on(ConfigIPC.IsPackaged, (e) => {
    e.returnValue = app.isPackaged;
  })

}
