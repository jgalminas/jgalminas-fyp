import { app, ipcMain } from "electron";
import { PathIPC } from "../../shared/ipc";

export default () => {

  ipcMain.on(PathIPC.Get, (e, path: Parameters<typeof app.getPath>[0]) => {
    e.returnValue = app.getPath(path);
  })

  ipcMain.on("packaged", (e) => {
    e.returnValue = app.isPackaged;
  })

}
