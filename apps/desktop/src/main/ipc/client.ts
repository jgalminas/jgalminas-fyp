import { ipcMain } from "electron"
import { clientManager } from ".."
import { ClientIPC } from "../../shared/ipc";

export default () => {

  ipcMain.handle(ClientIPC.Player, (_) => {
    return clientManager.getPlayer();
  });

  ipcMain.handle(ClientIPC.Status, (_) => {
    return clientManager.isConnected();
  })

}