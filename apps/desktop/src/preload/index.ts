import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { MatchRecorder } from './match/matchRecorder';
import { ClientManager } from './clientManager';
import { RecordingChannels } from '../channels';

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export type PreloadAPI = typeof api;

// Custom APIs for renderer

const api = {
  file: {
    getVideos: async() => await ipcRenderer.invoke(RecordingChannels.Videos)
  }
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



export const clientManager = new ClientManager();

const init = async() => {
  await clientManager.init();
  await new MatchRecorder().init();
}

init();