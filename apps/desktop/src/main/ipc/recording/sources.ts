import { desktopCapturer, ipcMain } from "electron";

export default () => {

  ipcMain.handle("recording:sources", async() => {
    return await desktopCapturer.getSources({ types: ['window'] });
  });
  
}