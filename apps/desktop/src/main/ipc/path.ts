import { app, ipcMain } from "electron";

export default () => {

  ipcMain.on("path:get", (e, path: Parameters<typeof app.getPath>[0]) => {
    e.returnValue = app.getPath(path);
  })
  
}