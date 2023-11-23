import { ipcMain } from "electron"
import { clientManager } from ".."

export default () => {

  ipcMain.handle('client:player', (_) => {
    return clientManager.getPlayer();
  });

  ipcMain.handle('client:status', (_) => {
    return clientManager.isConnected();
  })

}