import { ipcMain } from "electron";
import { SettingsIPC } from "../../shared/ipc";
import { settingsManager } from "..";
import { Settings } from "../../shared/settings";

export default () => {

  ipcMain.on(SettingsIPC.Get, (e) => {
    e.returnValue = settingsManager.getSettings();
  });

  ipcMain.handle(SettingsIPC.Set, async(_, settings: Settings) => {
    return await settingsManager.setSettings(settings);
  })

}