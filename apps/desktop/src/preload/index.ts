import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { MatchRecorder } from './matchRecorder';
import env from '../env';
import { ClientIPC, FileIPC } from '../shared/ipc';
import { IMatch, IRecording } from '@fyp/types';

export type PreloadAPI = typeof api;

// Custom APIs for renderer

const api = {
  file: {
    getThumbnail: async(id: string): Promise<string> => await ipcRenderer.invoke(FileIPC.GetThumbnail, id),
    createHighlights: async(data: { match: IMatch, recording: IRecording, puuid: string }) => await ipcRenderer.invoke(FileIPC.CreateHighlights, data)
  },
  client: {
    player: () => ipcRenderer.invoke(ClientIPC.Player)
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

  fetch(env.RENDERER_VITE_API_URL + '/v1/match', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

});

ipcRenderer.on('recording:post', (_, data) => {
  console.log(data);
  fetch(env.RENDERER_VITE_API_URL + '/v1/recording', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
})