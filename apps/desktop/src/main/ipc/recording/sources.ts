import { desktopCapturer, ipcMain } from "electron";
import { RecordingChannels } from "./index";

const registerHandlers = () => {

  ipcMain.handle(RecordingChannels.Sources, async() => {
    return await desktopCapturer.getSources({ types: ['window'] });
  });
  
}

export default registerHandlers;