import { mainWindow } from "./index";

export type RecordingIPCManagerPost = {
  match: string
}

export class RecordingIPCManager {

  public post(data: RecordingIPCManagerPost) {
    mainWindow?.webContents.send('recording:post', data);
  }

} 