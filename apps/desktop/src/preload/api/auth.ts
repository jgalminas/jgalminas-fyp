import { ipcRenderer } from 'electron';

export const auth = {
  getSession: async() => await ipcRenderer.invoke('auth.getSession'),
  logIn: async(credentials: string) => await ipcRenderer.invoke('auth.logIn', credentials)
};