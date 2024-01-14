import { ipcRenderer } from "electron";
import { GAME_CLIENT_NAME, VIDEO_DIRECTORY, VIDEO_FORMAT } from "../constants";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { Readable } from "stream";
import path from "path";
import { captureThumbnail } from "../shared/util/recording";
import { PathIPC, RecorderIPC } from "../shared/ipc";

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export class MatchRecorder {
  
  private readable: Readable | undefined;
  private recorder: MediaRecorder | undefined;
  private running: boolean = false;
  private videosPath = path.join(ipcRenderer.sendSync(PathIPC.Get, 'videos'), VIDEO_DIRECTORY);
  private gameId: string | undefined; 

  public init = async() => {
    ipcRenderer.on(RecorderIPC.Start, async(_, game) => {
      const client = await this.getGameClient(); 
      this.gameId = game.gameId.toString();
      await this.start(client, this.gameId as string);
    });

    ipcRenderer.on(RecorderIPC.Finish, () => {
      this.stop();
    })
  }

  private start = async(source: Electron.DesktopCapturerSource, fileName: string) => {

    const videoPath = path.join(this.videosPath, `${fileName}.${VIDEO_FORMAT}`);
    this.running = true;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        // @ts-ignore
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
        },
      },
      video: {
        // @ts-ignore
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: 1920,
          maxWidth: 1920,
          minHeight: 1080,
          maxHeight: 1080,
          frameRate: {
            ideal: 60
          }
        }
      }
    });    

    this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=h264' });
    this.readable = new Readable({ read() {} });

    this.recorder.ondataavailable = async(e) => {

      const reader = e.data.stream().getReader();

      while (true && this.running) {
        const { done, value } = await reader.read();
        if (done) break;
        this.readable?.push(value);
      }

    }

    this.recorder.start(1000);

    ffmpeg()
    .input(this.readable)
    .inputFormat('webm')
    .videoCodec('libx264')
    .audioCodec('aac')
    .output(videoPath)
    .on('end', async() => {
      await captureThumbnail(videoPath);
      ipcRenderer.send(RecorderIPC.Response);
    })
    .run();
    
  }

  private stop = () => {
    this.recorder?.stop();
    this.running = false;
    this.readable?.push(null);
  }

  private getGameClient = async(): Promise<Electron.DesktopCapturerSource> => {
    return new Promise((resolve, _) => {
      const interval = setInterval(async() => {
        const sources: Electron.DesktopCapturerSource[] = await ipcRenderer.invoke("recording:sources");
        const client = sources.find((x) => x.name === GAME_CLIENT_NAME);
        
        if (client) {
          clearTimeout(interval);
          resolve(client);
        };

      }, 1000);
  
    });
  }

}