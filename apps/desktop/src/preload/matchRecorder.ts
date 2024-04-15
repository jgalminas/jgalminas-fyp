import { ipcRenderer } from "electron";
import { GAME_CLIENT_NAME, THUMBNAIL_FORMAT, VIDEO_FORMAT } from "../constants";
import { Readable } from "stream";
import path from "path";
import { PathIPC, RecorderIPC, SettingsIPC } from "../shared/ipc";
import { Settings } from "../shared/settings";
import { ffmpeg } from ".";
import { VIDEO_DIRECTORY } from "./constants";

export class MatchRecorder {

  private readable: Readable | undefined;
  private recorder: MediaRecorder | undefined;
  private running: boolean = false;
  private videosPath = path.join(ipcRenderer.sendSync(PathIPC.Get, 'videos'), VIDEO_DIRECTORY);
  private gameId: string | undefined;

  public constructor() {
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

    const settings: Settings = ipcRenderer.sendSync(SettingsIPC.Get);

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
          width: { ideal: 4096 },
          height: { ideal: 2160 },
          frameRate: {
            ideal: settings.frameRate,
            max: settings.frameRate
          }
        }
      }
    });

    // Stop recording if window closes prematurely
    const track = stream.getVideoTracks()[0];
    track.addEventListener('ended', () => this.stop());

    this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=h264' });
    this.readable = new Readable({
      read() {},
      async destroy() {
        stream.getTracks().forEach((t) =>  t.stop())
      }
    });

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
    .videoCodec('copy')
    .audioCodec('aac')
    .videoBitrate(settings.resolution)
    .output(videoPath)
    .on('end', async() => {
      await this.captureThumbnail(videoPath);
      ipcRenderer.send(RecorderIPC.Response);
      this.readable?.destroy();
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

  private captureThumbnail = async(filePath: string): Promise<string> => {
    const thumbnailPath = filePath.replace(VIDEO_FORMAT, THUMBNAIL_FORMAT);
    return new Promise((resolve, reject) => {
      try {
        ffmpeg()
        .input(filePath)
        .inputFormat('mp4')
        .videoCodec('mjpeg')
        .seekInput('03:00')
        .frames(1)
        .output(thumbnailPath)
        .on('end', () => resolve(thumbnailPath))
        .on('error', () => reject())
        .run()
      } catch (err) {
        reject(err);
      }
    })
  }

}
