import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { MatchRecorder } from './matchRecorder';
import { ClientIPC, FileIPC } from '../shared/ipc';
import { IRecording } from '@fyp/types';

export type PreloadAPI = typeof api;

// Custom APIs for renderer

const api = {
  file: {
    getThumbnail: async(id: string): Promise<{ message: 'OK', path: string } | { message: 'VIDEO_NOT_FOUND' }> => {
      return await ipcRenderer.invoke(FileIPC.GetThumbnail, id);
    },
    createHighlights: async(
      data: {
        timeframes: {
          frame: number,
          timestamp: number
        }[],
        matchDuration: number,
        recording: IRecording
      }) => {
      return await ipcRenderer.invoke(FileIPC.CreateHighlights, data);
    }
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