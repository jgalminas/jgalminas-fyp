import { ipcRenderer } from "electron";
import { GAME_CLIENT_NAME, VIDEO_DIRECTORY, VIDEO_FORMAT } from "../constants";
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from "stream";
import path from "path";
import { captureThumbnail } from "../shared/util/recording";
import { PathIPC, RecorderIPC, SettingsIPC } from "../shared/ipc";
import { Settings } from "../shared/settings";
import { ffmpegPath } from 'ffmpeg-ffprobe-static';
ffmpeg.setFfmpegPath(ffmpegPath as string);

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
      await captureThumbnail(videoPath);
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

}
