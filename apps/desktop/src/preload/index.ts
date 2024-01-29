import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { MatchRecorder } from './matchRecorder';
import { ClientIPC, FileIPC, SettingsIPC } from '../shared/ipc';
import { IRecording } from '@fyp/types';
import { Settings } from '../shared/settings';

export type PreloadAPI = typeof api;

// Custom APIs for renderer

const api = {
  file: {
    getThumbnail: async(id: string, type: 'recordings' | 'highlights'): Promise<{ message: 'OK', path: string } | {  message: 'VIDEO_NOT_FOUND' }> => {
      return await ipcRenderer.invoke(FileIPC.GetThumbnail, id, type);
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