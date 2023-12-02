import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { MatchRecorder } from './matchRecorder';
import env from '../env';
// import { ClientManager } from '../main/clientManager';

ffmpeg.setFfmpegPath(ffmpegStatic as string);

export type PreloadAPI = typeof api;

// Custom APIs for renderer

const api = {
  file: {
    getVideos: async() => {      
      return await ipcRenderer.invoke("recording:videos")
    }
  },
  client: {
    player: () => ipcRenderer.invoke('client:player')
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

const init = async() => {
  await new MatchRecorder().init();
}

init();

ipcRenderer.on('match:data', (_, data) => {

  fetch(env.RENDERER_VITE_API_URL + '/v1/match/post', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

});