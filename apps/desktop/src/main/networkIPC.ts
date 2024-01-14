import { mainWindow } from "./index";

export class NetworkIPC {

  public recording = {
    post: (data: {
      match: string,
      position?: string,
      champion: string,
      gameId: string,
      length: number,
      createdAt: Date,
      size: number,
      queueId: number
    }) => mainWindow?.webContents.send('recording:post', data)
  }

} 