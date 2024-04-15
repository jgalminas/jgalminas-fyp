import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { MatchRecorder } from './matchRecorder';
import { ClientIPC, ConfigIPC, FileIPC, SettingsIPC } from '../shared/ipc';
import { HighlightTimeframe, IRecording } from '@fyp/types';
import { Settings } from '../shared/settings';
import _ffmpeg from 'fluent-ffmpeg';
import { ffmpegPath, ffprobePath } from 'ffmpeg-ffprobe-static';
import path from 'path';

if (ipcRenderer.sendSync(ConfigIPC.IsPackaged) === true) {
  const unpackedPath = path.resolve(process.resourcesPath, 'app.asar.unpacked', 'node_modules')
  const customFfmpegPath = path.join(unpackedPath, (ffmpegPath as string).split('node_modules')[1]);
  const customFfprobePath = path.join(unpackedPath, (ffprobePath as string).split('node_modules')[1]);
  _ffmpeg.setFfmpegPath(customFfmpegPath);
  _ffmpeg.setFfprobePath(customFfprobePath);
} else {
  _ffmpeg.setFfmpegPath(ffmpegPath as string);
  _ffmpeg.setFfprobePath(ffprobePath as string);
}

export const ffmpeg = _ffmpeg;
export type PreloadAPI = typeof api;

new MatchRecorder();

// Custom APIs for renderer

const api = {
  file: {
    getThumbnail: async(id: string, type: 'recordings' | 'highlights'): Promise<{ message: 'OK', path: string } | {  message: 'VIDEO_NOT_FOUND' }> => {
      return await ipcRenderer.invoke(FileIPC.GetThumbnail, id, type);
    },
    createHighlights: async(
      data: {
        timeframes: HighlightTimeframe[],
        matchDuration: number,
        recording: IRecording
      }) => {
      return await ipcRenderer.invoke(FileIPC.CreateHighlights, data);
    },
    createHighlight: async(
      data: {
        timeframe: HighlightTimeframe,
        recording: IRecording
      }): Promise<{ status: "ERROR", message: string } | { status: "OK", id: string  }> => {
      return await ipcRenderer.invoke(FileIPC.CreateHighlight, data);
    },
    deleteRecording: async(args: { id: string, fileName: string, type: 'recording' | 'highlight' }) => await ipcRenderer.invoke(FileIPC.Delete, args)
  },
  client: {
    player: () => ipcRenderer.invoke(ClientIPC.Player)
  },
  events: {
    on: <T>(channel: string, callback: (event: IpcRendererEvent, data: T) => void) => {

      const subscription = (event: IpcRendererEvent, data: T) => callback(event, data);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      }
    }
  },
  settings: {
    get: (): Settings | undefined => ipcRenderer.sendSync(SettingsIPC.Get),
    set: async(settings: Settings): Promise<void> => await ipcRenderer.invoke(SettingsIPC.Set, settings)
  },
  getVideoPort: () => ipcRenderer.sendSync(ConfigIPC.VideoPort)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api;
}
