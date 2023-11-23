import { desktopCapturer, ipcMain } from "electron";
import { RecordingChannels } from "../../../channels";


export default () => {

  ipcMain.handle(RecordingChannels.Sources, async() => {
    return await desktopCapturer.getSources({ types: ['window'] });
  });
  
}