import { app, ipcMain } from "electron";

export enum PathChannels {
  Get = "path:get"
}

const registerHandlers = () => {

  ipcMain.on(PathChannels.Get, (e, path: Parameters<typeof app.getPath>[0]) => {
    e.returnValue = app.getPath(path);
  })
  
}

export default registerHandlers;

